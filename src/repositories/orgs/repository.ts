import { Organization } from "../../models/orgs";

export interface OrganizationRepository {
  getById(orgId: string): Promise<Organization[]>;
}
