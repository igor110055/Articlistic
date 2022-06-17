import React from "react";
import userImage from "../../../../Images/user-image.png";
import "./top-funder.css";
function TopFunderCard({ isFirstFunder }) {
  return (
    <div className="mobile-top-funder-container">
      <div className="mobile-top-funder-writer-details">
        <div className="mobile-top-funder-writer-info">
          <img
            src={userImage}
            className="mobile-top-funder-writer-profile-pic"
            alt="user"
          />
          <span className="mobile-top-funder-writer-name">James Delany</span>
        </div>
        <button className="mobile-top-funder-follow-button">Follow</button>
      </div>
    </div>
  );
}

export default TopFunderCard;
