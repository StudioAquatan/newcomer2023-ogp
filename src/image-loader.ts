import { WorkersEnv } from ".";
import { OgpOrg } from "./query";

type ImageLoaderProps = {
  env: WorkersEnv;
  src: string;
  width: number;
  quality: number;
};

export function imgixLoader({ env, src, width, quality }: ImageLoaderProps) {
  const newtPrefix = env.NEWT_ROOT ?? "newt/";
  const assetsPrefix = env.RESOURCE_URL ?? "assets/";
  if (src.startsWith(newtPrefix)) {
    src = src.replace(newtPrefix, "newt/");
  } else if (src.startsWith(assetsPrefix)) {
    src = src.replace(assetsPrefix, "assets");
  } else {
    return src;
  }
  return `https://${env.IMGIX_DOMAIN}/${src}?auto=format&fit=max&w=${width}&width=${width}&q=${quality}`;
}

export default function replaceImgixUrl({
  env,
  orgs,
  width = 80,
  quality = 75,
}: {
  env: WorkersEnv;
  orgs: OgpOrg[];
  width?: number;
  quality?: number;
}) {
  return orgs.map((org) => {
    return {
      ...org,
      logo: {
        src: imgixLoader({
          env,
          src: org.logo.src,
          width: width,
          quality: quality,
        }),
        width: width,
        height: width, // ?
      },
    };
  });
}
