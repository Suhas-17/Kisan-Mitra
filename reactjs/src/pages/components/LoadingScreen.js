import React from "react";
import { useAuth } from "../../context/AuthContext";
import { SpinnerCircular } from "spinners-react";

const style = {
  position: "fixed",
  background: "#303030",
  width: "100%",
  height: "100%",
  zIndex: 100,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

function Loading() {
  const { loadingScreen } = useAuth();
  return (
    loadingScreen && (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div style={style}>
          <SpinnerCircular color="rgba(83, 187, 73,1)" />
        </div>
      </div>
    )
  );
}

export default Loading;
