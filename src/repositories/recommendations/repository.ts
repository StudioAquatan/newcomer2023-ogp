import { HTTPException } from "hono/http-exception";
import { SimpleRecommend } from "../../models/recommendations";
import { RecommendRepository } from "./impl";

// DBから取得した結果
// 返す型はSimpleRecommend classに変換する
type RecommendResult = {
  id: string;
  orgs: string;
};

export class RecommendRepositoryImpl implements RecommendRepository {
  constructor(private database: D1Database) {}

  async getById(userId: string): Promise<SimpleRecommend> {
    const results = await this.database
      .prepare("SELECT id, orgs FROM recommendation WHERE id = ?")
      .bind(userId)
      .all<RecommendResult>();

    if (!results.success) {
      throw new HTTPException(500, { message: "Database error" });
    } else if (!results.results?.length) {
      throw new HTTPException(404, {
        message: "Not found user recommendation",
      });
    }

    const result = results.results[0];

    return new SimpleRecommend(
      userId,
      // 診断結果はJSON形式で保存されているのでパースする
      JSON.parse(result.orgs)
    );
  }
}
