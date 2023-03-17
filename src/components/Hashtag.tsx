const Irodukun = () => (
  <img
    src="https://irodori-newcomer2023.pages.dev/org_icons/irodori_logo.png"
    style={{
      width: "30px",
      height: "30px",
    }}
  />
);

const StudioAquatan = () => (
  <img
    src="https://irodori-newcomer2023.pages.dev/org_icons/studioaquatan.png"
    style={{
      width: "30px",
      height: "30px",
    }}
  />
);

export default function Hashtag() {
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
      <Irodukun />
      <h3
        style={{
          padding: 0,
          margin: 0,
          fontFamily: "GenJyuuGothic-P, sans-serif",
          fontWeight: "bold",
          fontSize: "32px",
        }}
      >
        #KIT相性診断
      </h3>
      <StudioAquatan />
    </div>
  );
}
