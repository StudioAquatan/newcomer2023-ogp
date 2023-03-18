import { Hono } from "hono";
import { ogpImage } from "./ogp";
import { getTop3RecommendedOrgs } from "./query";

export type Env = {
  DB: D1Database;
  OGP_KV: KVNamespace;
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
  return ctx.json(await getTop3RecommendedOrgs(ctx.env.DB, userId));
  // const ogp = await ogpImage(userId);
  // await ctx.env.OGP_KV.put(kvId(userId), ogp, {
  //   expirationTtl: 3600,
  // });

  // return ctx.body(ogp);
});

export default app;
