import React from "react";
import "./responseMenu.css";
import HighlightSVG from "../../../Images/HighlightSVG.svg";
import MeaningfulSVG from "../../../Images/MeaningfulSVG.svg";
import RespondSVG from "../../../Images/RespondSVG.svg";
import ShareSVG from "../../../Images/ShareSVG.svg";

function ResponseMenu() {
  const handleMeaningful = () => {
    return 0;
  };
  return (
    <div className="response-menu">
      <div className="response-menu-content">
        <button className="response-menu-button" onClick={handleMeaningful}>
          <img src={MeaningfulSVG} alt="share" />
          <span className="response-menu-button-span">Meaningful</span>
        </button>
        <button className="response-menu-button">
          <img src={HighlightSVG} alt="share" />
          <span className="response-menu-button-span">Highlight</span>
        </button>
        <button className="response-menu-button">
          <img src={RespondSVG} alt="share" />
          <span className="response-menu-button-span">Respond</span>
        </button>
        <button className="response-menu-button">
          <img src={ShareSVG} alt="share" />
          <span className="response-menu-button-span">Share</span>
        </button>
      </div>
    </div>
  );
}

export default ResponseMenu;
