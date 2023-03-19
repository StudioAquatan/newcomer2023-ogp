import { Hono } from "hono";
import { ogpImage } from "./ogp";
import { getTop3RecommendedOrgs } from "./query";

export type Env = {
  API: ServiceWorkerGlobalScope;
  DB: D1Database;
  OGP_KV: KVNamespace;
  ASSETS: R2Bucket;
};

const app = new Hono<{ Bindings: Env }>();

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

app.put("/", async (ctx) => {
  const userId = ctx.req.query("uid");
  if (!userId) return ctx.status(404);

  // キャッシュを上書き
  const orgs = await getTop3RecommendedOrgs(ctx.env, userId);
  const ogp = await ogpImage({ env: ctx.env, orgs: orgs });
  await ctx.env.OGP_KV.put(kvId(userId), ogp, {
    expirationTtl: 3600,
  });

  return ctx.status(200);
});

app.delete("/", async (ctx) => {
  const userId = ctx.req.query("uid");
  if (!userId) return ctx.status(404);

  // キャッシュを削除
  await ctx.env.OGP_KV.delete(kvId(userId));
  return ctx.status(200);
});

export default app;
