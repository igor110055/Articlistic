import "./button.css";
import { CircularProgress } from "@mui/material";
// import React from "react";

function Button({ text, blue, isSvg, Svg, callback, isDisabled }) {
  return (
    <button
      className="primary-button"
      onClick={callback}
      style={
        blue
          ? {
              background:
                "linear-gradient(183.89deg, #365FFE -61.88%, #59B5FF 124.42%)",
              transform: "rotate(-180deg)",
              border: "none",
            }
          : {}
      }
      disabled={isDisabled}
    >
      {isSvg && <div className="svg-container">{isSvg && <Svg />}</div>}
      {isDisabled ? (
        <CircularProgress size={20} style={{ color: "white" }} />
      ) : (
        <span
          className="button-text"
          style={
            blue
              ? {
                  color: "#fff",
                  transform: "rotate(180deg)",
                }
              : {}
          }
        >
          {text}
        </span>
      )}
    </button>
  );
}

export default Button;
