import { Imgix } from "../imgix";
import { Image } from "./orgs";

export class OgpRecommendItem {
  constructor(
    public shortName: string,
    public logoFocus: boolean,
    public logo: Image
  ) {}

  static replaceImgixUrl(imgix: Imgix, items: OgpRecommendItem[]) {
    return items.map((item) => {
      return new OgpRecommendItem(item.shortName, item.logoFocus, {
        ...item.logo,
        src: imgix.replaceImgixUrl(item.logo.src, 80, 75),
      });
    });
  }
}
