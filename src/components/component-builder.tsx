import { ReactNode } from "react";
import { OgpRecommendItem } from "../models/ogp";
import Container from "./Container";
import Hashtag from "./Hashtag";
import Recommendation from "./Recommendation";
import Title from "./Title";

export interface ComponentBuilder {
  build(recommends: OgpRecommendItem[]): ReactNode;
}

export class RecommendComponentBuilder implements ComponentBuilder {
  private img_studioAquatan: string;
  private img_irodukun: string;

  constructor(
    private resouce_url: string,
    private optimizer?: (src: string, width: number, quality: number) => string
  ) {
    if (this.optimizer === undefined) {
      this.optimizer = (str: string) => str;
    }

    this.img_studioAquatan = this.optimizer(
      `${resouce_url}/studioaquatan.png`,
      30,
      75
    );
    this.img_irodukun = this.optimizer(
      `${resouce_url}/irodori_logo.png`,
      30,
      75
    );
  }

  build(recommends: OgpRecommendItem[]): ReactNode {
    return (
      <Container>
        <Title />
        <Recommendation orgs={recommends} />
        <Hashtag orgIconSrcs={[this.img_irodukun, this.img_studioAquatan]} />
      </Container>
    );
  }
}
