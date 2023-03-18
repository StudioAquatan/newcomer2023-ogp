import satori, { init } from "satori/wasm";
import initYoga from "yoga-wasm-web";
// @ts-ignore
import yogaWasm from "./vender/yoga.wasm";
// @ts-ignore
import { Resvg, initWasm } from "@resvg/resvg-wasm";
// @ts-ignore
import resvgWasm from "./vender/resvg.wasm";
import type { ReactNode } from "react";
import { loadFont } from "./font";
import Container from "./components/Container";
import Logo from "./components/Hashtag";
import Hashtag from "./components/Hashtag";
import Title from "./components/Title";
import Recommendation from "./components/Recommendation";
import { OgpOrg } from "./query";

const genModuleInit = () => {
  let isInit = false;
  return async () => {
    if (isInit) {
      return;
    }

    // @ts-ignore
    init(await initYoga(yogaWasm));
    await initWasm(resvgWasm);
    isInit = true;
  };
};

const moduleInit = genModuleInit();

export const generateImage = async (node: ReactNode) => {
  await moduleInit();

  const GenJyuuGothicPNormal = await loadFont(
    "https://irodori-newcomer2023.pages.dev/fonts/GenJyuuGothicP/GenJyuuGothic-P-Normal.ttf"
  );

  const GenJyuuGothicPBold = await loadFont(
    "https://irodori-newcomer2023.pages.dev/fonts/GenJyuuGothicP/GenJyuuGothic-P-Bold.ttf"
  );

  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "GenJyuuGothic-P",
        data: GenJyuuGothicPNormal,
        weight: 400,
      },
      {
        name: "GenJyuuGothic-P",
        data: GenJyuuGothicPBold,
        weight: 700,
      },
    ],
    // debug: true,
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
};

export const ogpImage = (props: { orgs: OgpOrg[] }) => {
  return generateImage(
    <Container>
      <Title />
      <Recommendation {...props} />
      <Hashtag />
    </Container>
  );
};
