import { Hono } from "hono";
import { ogpImage } from "./ogp";

const app = new Hono();

app.get("/", async (ctx) => {
  ctx.header("Cache-Control", "max-age=3600");
  return ctx.body(await ogpImage());
});

export default app;
