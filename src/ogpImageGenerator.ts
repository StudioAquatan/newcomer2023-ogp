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

export class OgpImageGenerator {
  constructor(private assets: R2Bucket) {}

  generate = async (node: ReactNode) => {
    await moduleInit();

    const GenJyuuGothicPNormal = await loadFont(this.assets, "normal.woff");

    const GenJyuuGothicPBold = await loadFont(this.assets, "bold.woff");

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
}
