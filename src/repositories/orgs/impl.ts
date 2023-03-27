import { HTTPException } from "hono/http-exception";
import { Image, Organization } from "../../models/orgs";
import { OrganizationRepository } from "./repository";

type ImageResult = {
  src: string;
  width: number;
  height: number;
};

type OrganizationApiResult = {
  id: string;
  fullName: string;
  shortName: string;
  shortDescription: string;
  logo?: ImageResult;
  logoFocus: boolean;
  stampBackground?: ImageResult;
  stampColor?: string;
  altLogo?: ImageResult;
  description: string;
  location?: string;
  fees?: string;
  activeDays?: string;
  links?: string[];
};

export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(private api: ServiceWorkerGlobalScope) {}

  async fetchFromApi(orgId: string): Promise<OrganizationApiResult[]> {
    const response = await this.api.fetch(
      "https://newcomer2023-api-dev.studioaquatan.workers.dev/orgs"
    );

    if (!response.ok) {
      console.log(response.status, response.statusText);
      console.log(await response.text());
      throw new HTTPException(500, { message: "Failed to fetch orgs" });
    }

    return await response.json<OrganizationApiResult[]>();
  }

  private convertToOrgModel(org: OrganizationApiResult): Organization {
    return new Organization(
      org.id,
      org.fullName,
      org.shortName,
      org.shortDescription,
      org.logo || null,
      org.logoFocus,
      org.stampBackground || null,
      org.stampColor || null,
      org.altLogo || null,
      org.description,
      org.location || null,
      org.fees || null,
      org.activeDays || null,
      org.links ?? []
    );
  }

  async getById(orgId: string): Promise<Organization[]> {
    const response = await this.fetchFromApi(orgId);
    return response.map((item) => this.convertToOrgModel(item));
  }
}
