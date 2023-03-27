export class SimpleRecommendItem {
  constructor(public orgId: string, public coefficient: number) {}
}

export class SimpleRecommend {
  constructor(public userId: string, public orgs: SimpleRecommendItem[]) {}
}
