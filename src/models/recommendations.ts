import { HTTPException } from "hono/http-exception";
import { Exclusion } from "./exclusion";
import { OgpRecommendItem } from "./ogp";
import { Organization } from "./orgs";

export class SimpleRecommendItem {
  constructor(public orgId: string, public coefficient: number) {}
}

export class RecommendItem {
  constructor(
    public orgId: string,
    public coefficient: number,
    public isExcluded: boolean
  ) {}

  static sortRecommends(recommends: RecommendItem[]): RecommendItem[] {
    return recommends.slice().sort((a, b) => {
      if (a.isExcluded && b.isExcluded) return 0;
      if (a.isExcluded) return 1;
      if (b.isExcluded) return -1;
      return a.coefficient - b.coefficient;
    });
  }

  static getTop3Recommends(
    recommends: RecommendItem[],
    orgs: Organization[]
  ): OgpRecommendItem[] {
    const sorted = this.sortRecommends(recommends);
    const top3: OgpRecommendItem[] = [];

    for (const item of sorted) {
      // 除外されている団体は無視
      if (item.isExcluded) continue;

      const org = orgs.find((org) => {
        return org.id === item.orgId;
      });

      if (!org) {
        throw new HTTPException(500, {
          message:
            "Recommended organizations is not found in all organizations.",
        });
      }

      if (!org.logo) {
        throw new HTTPException(500, {
          message: "Recommended organizations has no logo.",
        });
      }

      top3.push(new OgpRecommendItem(org.shortName, org.logoFocus, org.logo));

      if (top3.length >= 3) break;
    }
    return top3;
  }
}

export class SimpleRecommend {
  constructor(public userId: string, public orgs: SimpleRecommendItem[]) {}
  applyExclusion(exclusion: Exclusion[]): RecommendItem[] {
    return this.orgs.map((org) => {
      return new RecommendItem(
        org.orgId,
        org.coefficient,
        exclusion.some((ex) => ex.orgId === org.orgId)
      );
    });
  }
}
