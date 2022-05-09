import "./button.css";
import React from "react";

function Button({ text, blue, isSvg, Svg, callback }) {
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
              border: "none"
            }
          : {}
      }
    >
      {isSvg && <div className="svg-container">{isSvg && <Svg />}</div>}
      <span
        className="button-text"
        style={
          blue
            ? {
                color: "#fff",
                transform: "rotate(180deg)"
              }
            : {}
        }
      >
        {text}
      </span>
    </button>
  );
}

export default Button;
