import { Hono } from "hono";
import { RecommendComponentBuilder } from "./components/component-builder";
import { OgpController } from "./controller/ogp";
import { Imgix } from "./imgix";
import { OgpImageGenerator } from "./ogpImageGenerator";
import { ExclusionRepositoryImpl } from "./repositories/exclusion/impl";
import { OgpImagesRepositoryImpl } from "./repositories/ogpImages/impl";
import { OrganizationRepositoryImpl } from "./repositories/orgs/impl";
import { RecommendRepositoryImpl } from "./repositories/recommendations/repository";

export type WorkersEnv = {
  IMGIX_DOMAIN: string;
  NEWT_ROOT: string;
  RESOURCE_URL: string;
  API: ServiceWorkerGlobalScope;
  DB: D1Database;
  OGP_KV: KVNamespace;
  OGP_QUEUE: Queue;
  ASSETS: R2Bucket;
};

export type HonoEnv = { Bindings: WorkersEnv };

const createApplication = (env: WorkersEnv) => {
  const imgix = new Imgix(env.IMGIX_DOMAIN, env.NEWT_ROOT, env.RESOURCE_URL);
  const recommendComponentBuilder = new RecommendComponentBuilder(
    env.RESOURCE_URL,
    (src, width, quality) => {
      return imgix.replaceImgixUrl(src, width, quality);
    }
  );
  const ogpImageGenerator = new OgpImageGenerator(env.ASSETS);
  const ogpImagesRepository = new OgpImagesRepositoryImpl(env.OGP_KV);
  const organizationReposiotry = new OrganizationRepositoryImpl(env.API);
  const recommendationRepository = new RecommendRepositoryImpl(env.DB);
  const exclusionRepository = new ExclusionRepositoryImpl(env.DB);

  const ogpController = new OgpController(
    imgix,
    recommendComponentBuilder,
    ogpImageGenerator,
    ogpImagesRepository,
    organizationReposiotry,
    recommendationRepository,
    exclusionRepository
  );

  return {
    imgix,
    recommendComponentBuilder,
    ogpImageGenerator,
    ogpImagesRepository,
    organizationReposiotry,
    recommendationRepository,
    exclusionRepository,
    ogpController,
  };
};

const app = new Hono<HonoEnv>();

app.get("/", async (ctx) => {
  const { ogpController } = createApplication(ctx.env);
  ogpController.getOgp(ctx);
});

export default {
  fetch: app.fetch,
  // Cloudflare QueueでOGP画像生成を非同期化
  async queue(batch: MessageBatch<string>, env: WorkersEnv) {
    const { ogpController } = createApplication(env);
    ogpController.queueOgp(batch);
  },
};
