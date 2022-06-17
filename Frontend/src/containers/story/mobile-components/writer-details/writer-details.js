import React from "react";
import userImage from "../../../../Images/user-image.png";
import MeaningfulSVG from "../../../../Images/MeaningfulSVG.svg";
import MobileStorySave from "../../../../Images/mobile-story-save.svg";
import MobileStoryTwitter from "../../../../Images/mobile-story-twitter.svg";
import MobileStoryShare from "../../../../Images/mobile-story-share.svg";
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
      <div className="web-social-interaction">
        <div className="mobile-social-interaction-div writer-details-interaction">
          <span className="meaningful-span">
            <img
              src={MeaningfulSVG}
              alt="meaningful"
              className="meaningful-svg"
            />
            <span>Meaningful</span>
            <span className="mobile-meaningful-separator" />
            <span>340</span>
          </span>

          <span>
            <img src={MobileStorySave} alt="save" />
          </span>
          <span>
            <img src={MobileStoryTwitter} alt="twitter" />
          </span>
          <span>
            <img src={MobileStoryShare} alt="share" />
          </span>
        </div>
      </div>
      <div className="follow-buttons">
        <button className="mobile-follow-button">Follow</button>
      </div>
    </div>
  );
}

export default WriterDetails;
