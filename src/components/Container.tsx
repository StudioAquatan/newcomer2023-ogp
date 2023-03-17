import { ReactNode } from "react";

const Contents = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "940px",
        height: "600px",
        backgroundColor: "white",
        boxShadow: "0 10px 16px 0 rgb(10 10 10 / 10%)",
        borderRadius: "10px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "40px",
      }}
    >
      {children}
    </div>
  );
};

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundImage: "linear-gradient(-45deg, #FFD1FF, #FAD0C4)",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Contents>{children}</Contents>
    </div>
  );
}
