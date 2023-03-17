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
    "https://irodori-newcomer-2023-dev.pages.dev/fonts/GenJyuuGothicP/GenJyuuGothic-P-Normal.ttf"
  );

  const GenJyuuGothicPBold = await loadFont(
    "https://irodori-newcomer-2023-dev.pages.dev/fonts/GenJyuuGothicP/GenJyuuGothic-P-Bold.ttf"
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
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
};

export const ogpImage = () => {
  return generateImage(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      <h1
        style={{
          fontFamily: "GenJyuuGothic-P, sans-serif",
          fontWeight: "normal",
          fontSize: 70,
          width: "100%",
        }}
      >
        Hello World!
      </h1>
    </div>
  );
};
