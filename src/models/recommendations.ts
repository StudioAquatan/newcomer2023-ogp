import { getTop3RecommendedOrgs } from "../query";
import { Exclusion } from "./exclusion";

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

  static getTopNRecommends(
    recommends: RecommendItem[],
    topN: number
  ): RecommendItem[] {
    const sorted = this.sortRecommends(recommends);
    return sorted.slice(0, topN);
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
