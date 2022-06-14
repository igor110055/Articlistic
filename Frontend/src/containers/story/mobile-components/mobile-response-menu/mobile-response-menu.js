import React from "react";
import userImage from "../../../../Images/user-image.png";
import MeaningfulSVG from "../../../../Images/MeaningfulSVG.svg";
import RespondSVG from "../../../../Images/RespondSVG.svg";
import ShareSVG from "../../../../Images/ShareSVG.svg";

import "./mobile-response-menu.css";
function MobileResponseMenu({ writerName, profilePic, setFundModalOpen }) {
  return (
    <div className="mobile-response-menu-container">
      <div className="mobile-response-menu-writer-details">
        <div className="mobile-response-menu-writer-profile-container">
          <img
            src={profilePic || userImage}
            alt="writer"
            className="mobile-response-menu-writer-profile-pic"
          />
          <div className="mobile-response-menu-writer-name-container">
            <span>To,</span>
            <span style={{ fontWeight: "600", marginTop: "-3px" }}>
              {writerName}
            </span>
          </div>
        </div>
        <div className="mobile-response-menu-fund-amount">
          <span>₹</span>
          <span className="mobile-response-menu-selected-fund-amount">100</span>
        </div>
      </div>
      <div className="mobile-response-menu-separator"></div>
      <div className="mobile-response-menu-funds">
        <div className="mobile-response-menu-fund-buttons-container">
          <button className="amount-button">30</button>
          <button className="amount-button">50</button>
          <button className="amount-button">100</button>
          <button className="amount-button">500</button>
        </div>
        <div className="mobile-response-menu-fund-button-container">
          <input
            className="fund-amount-input"
            placeholder="Message"
            style={{ width: "65%", margin: "0" }}
          />
          <button
            className="fund-button"
            style={{ width: "35%", height: "40px" }}
            onClick={() => setFundModalOpen(true)}
          >
            Fund
          </button>
        </div>
      </div>
      <div className="mobile-response-menu-separator"></div>
      <div className="mobile-response-menu-responses">
        <button className="mobile-response-menu-button">
          <img src={MeaningfulSVG} alt="share" />
          <span className="mobile-response-menu-button-span">Meaningful</span>
        </button>
        <button className="mobile-response-menu-button">
          <img src={RespondSVG} alt="share" />
          <span className="mobile-response-menu-button-span">Respond</span>
        </button>
        <button className="mobile-response-menu-button">
          <img src={ShareSVG} alt="share" />
          <span className="mobile-response-menu-button-span">Share</span>
        </button>
      </div>
    </div>
  );
}

export default MobileResponseMenu;
