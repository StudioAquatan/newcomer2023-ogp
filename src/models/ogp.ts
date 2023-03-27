import { Image } from "./orgs";

export class OgpRecommendItem {
  constructor(
    public shortName: string,
    public logoFocus: boolean,
    public logo: Image
  ) {}
}
