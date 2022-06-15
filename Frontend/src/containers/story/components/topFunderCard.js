import "./topFunderCard.css";
import userImage from "../../../Images/userPhoto.jpg";

import React from "react";

function TopFunderCard({ firstFunder }) {
  return (
    <div
      className={`topfunder-container ${
        firstFunder ? "firstfunder-container" : ""
      }`}
    >
      <div className="top-funder-content">
        <div className="top-funder-profile-image-container">
          <img
            src={userImage}
            alt="user"
            className={`top-funder-profile-image ${
              firstFunder ? "first-funder-profile-image" : ""
            }`}
          />
          <div className="top-funder-name top-funder-mobile-content">
            <h3 className="top-funder-original-name ">Ana de Armas</h3>
          </div>
          <button className="top-funder-follow-button">
            <span className="top-funder-follow-span"> Follow</span>
          </button>
        </div>
        <div className="top-funder-name top-funder-web-content">
          <h3 className="top-funder-original-name">Ana de Armas</h3>
          <h5 className="top-funder-username">@armasana</h5>
        </div>
        <div className="top-funder-details">
          <div className="top-funder-status">Found & CEO @TheTeaBooks</div>
          <div className="top-funder-interest">
            22 | Design | Tech | Books | Cats
          </div>
        </div>
        <div className="top-funder-follows">
          <span className="top-funder-following">
            <b>238</b> Following
          </span>
          <span className="top-funder-followers">
            <b>431</b> Followers
          </span>
        </div>
      </div>
      <div
        className={`top-funder-amount-div  ${
          firstFunder ? "first-funder-amount-div" : ""
        }`}
      >
        <span className="top-funder-fund-amount-funder-type">
          {firstFunder ? "First Funder" : "Top Funder"}
        </span>
        <span className="top-funder-fund-amount">₹100000</span>
      </div>
    </div>
  );
}

export default TopFunderCard;
