import { ReactNode } from "react";
import { OgpRecommendItem } from "../models/ogp";

function Container({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      {children}
    </div>
  );
}

function ItemContainer({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {children}
    </div>
  );
}

function RecommendationItem({ shortName, logoFocus, logo }: OgpRecommendItem) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <img
        src={logo.src}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "5px",
          /* stylelint-disable */
          objectFit: logoFocus ? "cover" : "contain",
          /* stylelint-enable */
        }}
      />
      <p
        style={{
          fontFamily: "GenJyuuGothic-P, sans-serif",
          fontWeight: "bold",
          fontSize: "40px",
          textAlign: "left",
          margin: 0,
          marginLeft: "40px",
          padding: 0,
        }}
      >
        {shortName}
      </p>
    </div>
  );
}

export default function Recommendation({ orgs }: { orgs: OgpRecommendItem[] }) {
  return (
    <Container>
      <p
        style={{
          fontFamily: "GenJyuuGothic-P, sans-serif",
          fontWeight: "normal",
          fontSize: "36px",
          textAlign: "center",
          margin: 0,
          padding: 0,
        }}
      >
        あなたへのおすすめTOP3は...
      </p>
      <ItemContainer>
        {orgs.map((item, index) => {
          return <RecommendationItem key={index} {...item} />;
        })}
      </ItemContainer>
    </Container>
  );
}
