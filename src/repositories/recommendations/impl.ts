import { SimpleRecommend } from "../../models/recommendations";

export interface RecommendRepository {
  fetchRecommend(userId: string): Promise<SimpleRecommend>;
}
