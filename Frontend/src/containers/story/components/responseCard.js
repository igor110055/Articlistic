import React from "react";
import "./responseCard.css";

/**
 * Response Card
 * @param {string}  selection from article
 * @param {object} type: response  containing response text and details of user
 * @param {array} type: array of comments  array containing comment and profile pic
 * @returns {element}
 */

function ResponseCard({ selection, response, comments = [] }) {
  return (
    <div className="response-card-container">
      <div className="main-response">
        <p className="response-selection-text">{selection}</p>
        <div className="user-response-container">
          <img
            src={response.profilePic}
            className="response-user-profile"
            alt="profile"
          />
          <div className="user-details">
            <p className="profile-name">{response.profileName}</p>
            <p className="user-response-text">{response.responseText}</p>
          </div>
        </div>
      </div>

      <div className="other-response">
        {comments.map((comment, idx) => (
          <div className="user-response-container" key={idx}>
            <img
              src={comment.profilePic}
              className="response-user-profile"
              alt="profile"
            />
            <div className="user-details">
              <p className="profile-name">{comment.profileName}</p>
              <p className="user-response-text">{comment.responseText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponseCard;
