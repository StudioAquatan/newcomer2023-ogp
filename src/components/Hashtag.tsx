type OrgIconProps = {
  src: string;
  width?: string;
  height?: string;
};

const OrgIcon = ({ src, width, height }: OrgIconProps) => (
  <img
    src={src}
    style={{
      width: width ?? "30px",
      height: height ?? "30px",
    }}
  />
);

export default function Hashtag({ orgIconSrcs }: { orgIconSrcs: string[] }) {
  if (orgIconSrcs.length !== 2) {
    throw new Error(`orgIconSrcs.length must be 2. got ${orgIconSrcs.length}`);
  }

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
      <OrgIcon src={orgIconSrcs[0]} />
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
      <OrgIcon src={orgIconSrcs[1]} />
    </div>
  );
}
