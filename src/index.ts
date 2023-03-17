import { Hono } from "hono";
import { ogpImage } from "./ogp";

export type Env = {
  OGP: KVNamespace;
};

const app = new Hono<{ Bindings: Env }>();

const kvId = (userId: string) => `ogp-${userId}`;

app.get("/", async (ctx) => {
  const userId = ctx.req.query("uid");
  if (!userId) return ctx.status(404);

  ctx.header("Cache-Control", "max-age=3600");

  // キャッシュからバイナリで取得
  const ogpCache = await ctx.env.OGP.get(kvId(userId), {
    type: "arrayBuffer",
  });
  if (ogpCache) {
    return ctx.body(ogpCache);
  }

  // キャッシュに無ければ生成
  const ogp = await ogpImage(userId);
  await ctx.env.OGP.put(kvId(userId), ogp, {
    expirationTtl: 3600,
  });

  return ctx.body(ogp);
});

export default app;
