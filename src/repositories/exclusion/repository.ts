import { Exclusion } from "../../models/exclusion";

export interface ExclusionRepository {
  fetchExclusion(userId: string): Promise<Exclusion[]>;
}
