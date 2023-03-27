import { Context } from "hono";
import { HonoEnv } from "../..";

export class OgpController {
  constructor() {}

  async getOgp(ctx: Context<HonoEnv>): Promise<Response> {
    return ctx.json({ status: "OK" });
  }
}
