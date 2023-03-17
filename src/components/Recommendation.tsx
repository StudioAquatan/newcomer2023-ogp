import { ReactNode } from "react";

type RecommendationItemType = {
  orgName: string;
  orgLogoSrc: string;
};

const recommendationItems: RecommendationItemType[] = [
  {
    orgName: "あくあたん工房",
    orgLogoSrc: "https://irodori-newcomer2023.pages.dev/org_icons/default.png",
  },
  {
    orgName: "ForteFibre",
    orgLogoSrc: "https://irodori-newcomer2023.pages.dev/org_icons/default.png",
  },
  {
    orgName: "アニメーション研究会",
    orgLogoSrc: "https://irodori-newcomer2023.pages.dev/org_icons/default.png",
  },
];

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

function RecommendationItem(props: RecommendationItemType) {
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
        src={props.orgLogoSrc}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "5px",
        }}
      />
      <p
        style={{
          fontFamily: "GenJyuuGothic-P, sans-serif",
          fontWeight: "bold",
          fontSize: "40px",
          textAlign: "left",
          margin: 0,
          padding: 0,
        }}
      >
        {props.orgName}
      </p>
    </div>
  );
}

export default function Recommendation() {
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
        {recommendationItems.map((item, index) => {
          return <RecommendationItem key={index} {...item} />;
        })}
      </ItemContainer>
    </Container>
  );
}
