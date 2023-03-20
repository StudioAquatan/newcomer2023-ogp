import { Env } from "..";
import replaceImgixUrl, { imgixLoader } from "../image-loader";

const Irodukun = ({ env }: { env: Env }) => (
  <img
    src={imgixLoader({
      env: env,
      src: `${env.RESOURCE_URL}/irodori_logo.png`,
      width: 30,
      quality: 75,
    })}
    style={{
      width: "30px",
      height: "30px",
    }}
  />
);

const StudioAquatan = ({ env }: { env: Env }) => (
  <img
    src={imgixLoader({
      env: env,
      src: `${env.RESOURCE_URL}/studioaquatan.png`,
      width: 30,
      quality: 75,
    })}
    style={{
      width: "30px",
      height: "30px",
    }}
  />
);

export default function Hashtag({ env }: { env: Env }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Irodukun env={env} />
      <h3
        style={{
          padding: 0,
          margin: 0,
          fontFamily: "GenJyuuGothic-P, sans-serif",
          fontWeight: "bold",
          fontSize: "32px",
        }}
      >
        #工繊53団体相性診断
      </h3>
      <StudioAquatan env={env} />
    </div>
  );
}
