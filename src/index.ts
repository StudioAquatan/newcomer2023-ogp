import { Hono } from "hono";
import { cors } from "hono/cors";
import { ogpImage } from "./ogp";
import { getTop3RecommendedOrgs } from "./query";

export type Env = {
  API: ServiceWorkerGlobalScope;
  DB: D1Database;
  OGP_KV: KVNamespace;
  OGP_QUEUE: Queue;
  ASSETS: R2Bucket;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin(origin) {
      return origin.includes("//localhost") ||
        origin.includes("irodori-newcomer2023.pages.dev")
        ? origin
        : "https://irodori-newcomer2023.pages.dev";
    },
    credentials: false,
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "DELETE"],
  })
);

const kvId = (userId: string) => `ogp-${userId}`;

app.get("/", async (ctx) => {
  const userId = ctx.req.query("uid");
  if (!userId) return ctx.status(404);

  ctx.header("Cache-Control", "max-age=3600");
  // キャッシュからバイナリで取得
  const ogpCache = await ctx.env.OGP_KV.get(kvId(userId), {
    type: "arrayBuffer",
  });
  if (ogpCache) {
    return ctx.body(ogpCache);
  }

  // キャッシュに無ければ生成
  const orgs = await getTop3RecommendedOrgs(ctx.env, userId);
  const ogp = await ogpImage({ env: ctx.env, orgs: orgs });
  await ctx.env.OGP_KV.put(kvId(userId), ogp, {
    expirationTtl: 3600,
  });

  return ctx.body(ogp);
});

app.post("/", async (ctx) => {
  const userId = ctx.req.query("uid");
  if (!userId) return ctx.status(404);

  await ctx.env.OGP_QUEUE.send(userId);

  return ctx.json({ status: "Enqueued" }, 202);
});

app.delete("/", async (ctx) => {
  const userId = ctx.req.query("uid");
  if (!userId) return ctx.status(404);

  // キャッシュを削除
  await ctx.env.OGP_KV.delete(kvId(userId));
  return ctx.status(204);
});

export default {
  fetch: app.fetch,
  // Cloudflare QueueでOGP画像生成を非同期化
  async queue(batch: MessageBatch<string>, env: Env) {
    const messages: string[] = batch.messages.map((msg) => msg.body);
    for (const message of batch.messages) {
      const userId = message.body;
      // OGP画像を生成して、キャッシュを上書き
      const orgs = await getTop3RecommendedOrgs(env, userId);
      const ogp = await ogpImage({ env: env, orgs: orgs });
      await env.OGP_KV.put(kvId(userId), ogp, {
        expirationTtl: 3600,
      });
    }
  },
};
