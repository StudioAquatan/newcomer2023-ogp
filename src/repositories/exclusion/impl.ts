import { Exclusion as ExclusionClass } from "../../models/exclusion";
import { ExclusionRepository } from "./repository";

type ExclusionType = {
  orgId: string;
};

export class ExclusionRepositoryImpl implements ExclusionRepository {
  constructor(private database: D1Database) {}

  async getById(userId: string): Promise<ExclusionClass[]> {
    const result = await this.database
      .prepare(`SELECT orgId FROM exclusion WHERE userId = ?`)
      .bind(userId)
      .all<ExclusionType>();

    return result.results?.map(({ orgId }) => new ExclusionClass(orgId)) ?? [];
  }
}
