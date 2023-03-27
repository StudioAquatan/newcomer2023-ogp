import { Exclusion } from "../../models/exclusion";

export interface ExclusionRepository {
  getById(userId: string): Promise<Exclusion[]>;
}
