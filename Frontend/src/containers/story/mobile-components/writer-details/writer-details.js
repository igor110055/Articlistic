import React from "react";
import userImage from "../../../../Images/user-image.png";

import "./writer-details.css";
function WriterDetails({ writerName, profilePic, readingTime, date }) {
  return (
    <div className="mobile-writer-details-container">
      <div className="writer-details-div">
        <img
          src={profilePic || userImage}
          alt="writer-profile"
          className="writer-img"
        />

        <div className="writer-details-text">
          <h4>{writerName}</h4>
          <div className="article-detail">
            {date} · {readingTime} read
          </div>
        </div>
      </div>
      <div className="follow-buttons">
        <button className="mobile-follow-button">Follow</button>
      </div>
    </div>
  );
}

export default WriterDetails;
