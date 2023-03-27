import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { HonoEnv } from "../..";
import { RecommendItem } from "../../models/recommendations";
import { ExclusionRepository } from "../../repositories/exclusion/repository";
import {
  NoOgpImageError,
  OgpImagesRepository,
} from "../../repositories/ogpImages/repository";
import { OrganizationRepository } from "../../repositories/orgs/repository";
import { RecommendRepository } from "../../repositories/recommendations/impl";

export class OgpController {
  constructor(
    private ogpRepo: OgpImagesRepository,
    private orgRepo: OrganizationRepository,
    private recommendationRepo: RecommendRepository,
    private exclusionRepo: ExclusionRepository
  ) {}

  async getOgp(ctx: Context<HonoEnv>): Promise<Response> {
    const { userId } = ctx.req.query();
    if (!userId)
      throw new HTTPException(404, {
        message: "uid is required",
      });

    try {
      // キャッシュからOGP画像を取得
      const ogpCache = await this.ogpRepo.getById(userId);
      return ctx.body(ogpCache);
    } catch (e) {
      if (e instanceof NoOgpImageError) {
        console.log(e.message);
      }
    }

    const recommends = await this.recommendationRepo.getById(userId);
    const orgs = await this.orgRepo.getById(userId);
    const exclusion = await this.exclusionRepo.getById(userId);

    const applied = recommends.applyExclusion(exclusion);
    const top3 = RecommendItem.getTop3Recommends(applied, orgs);

    // await this.ogpRepo.setById(userId, ogp);

    return ctx.json({ status: "OK" });
  }
}
