import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { HonoEnv } from "../..";
import { ComponentBuilder } from "../../components/component-builder";
import { Imgix } from "../../imgix";
import { OgpRecommendItem } from "../../models/ogp";
import { RecommendItem } from "../../models/recommendations";
import { OgpImageGenerator } from "../../ogpImageGenerator";
import { ExclusionRepository } from "../../repositories/exclusion/repository";
import {
  NoOgpImageError,
  OgpImagesRepository,
} from "../../repositories/ogpImages/repository";
import { OrganizationRepository } from "../../repositories/orgs/repository";
import { RecommendRepository } from "../../repositories/recommendations/impl";

export class OgpController {
  constructor(
    private imgix: Imgix,
    private recommendComponentBuilder: ComponentBuilder,
    private ogpImageGenerator: OgpImageGenerator,
    private ogpRepo: OgpImagesRepository,
    private orgRepo: OrganizationRepository,
    private recommendationRepo: RecommendRepository,
    private exclusionRepo: ExclusionRepository
  ) {}

  private async generateOgpImage(userId: string): Promise<Uint8Array> {
    const recommends = await this.recommendationRepo.getById(userId);
    const orgs = await this.orgRepo.getById(userId);
    const exclusion = await this.exclusionRepo.getById(userId);

    const applied = recommends.applyExclusion(exclusion);
    const top3 = RecommendItem.getTop3Recommends(applied, orgs);
    const top3withImgix = OgpRecommendItem.replaceImgixUrl(this.imgix, top3);

    const component = this.recommendComponentBuilder.build(top3withImgix);
    const ogp = await this.ogpImageGenerator.generate(component);
    return ogp;
  }

  async getOgp(ctx: Context<HonoEnv>): Promise<Response> {
    const userId = ctx.req.query("uid");
    if (!userId)
      throw new HTTPException(404, {
        message: "uid is required",
      });

    ctx.header("Cache-Control", "max-age=3600");
    try {
      // キャッシュからOGP画像を取得
      const ogpCache = await this.ogpRepo.getById(userId);
      return ctx.body(ogpCache);
    } catch (e) {
      if (e instanceof NoOgpImageError) {
        console.log(e.message);
      }
    }

    const ogp = await this.generateOgpImage(userId);
    // キャッシュにOGP画像を保存
    await this.ogpRepo.setById(userId, ogp);

    return ctx.body(ogp);
  }

  async queueOgp(batch: MessageBatch<string>) {
    const messages: string[] = batch.messages.map((msg) => msg.body);
    for (const message of batch.messages) {
      const userId = message.body;
      const ogp = await this.generateOgpImage(userId);
      await this.ogpRepo.setById(userId, ogp);
    }
  }
}
