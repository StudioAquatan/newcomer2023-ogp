import { SimpleRecommend } from "../../models/recommendations";

export interface RecommendRepository {
  getById(userId: string): Promise<SimpleRecommend>;
}
