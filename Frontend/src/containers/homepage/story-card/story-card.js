import React from "react";
import "./story-card.css";

function StoryCard({ article, writer }) {
  const { articlePic, readingTime, body, date, title } = article.public;

  const formatDate = () => {
    var d = new Date(parseInt(date, 10));
    var ds = d.toString("MM dd");
    return ds.substring(4, 10);
  };

  return (
    <div className="story-card-container">
      <img src={articlePic} className="articlePic" alt="articlePic" />

      <div className="story-title web-homepage-story-title">
        {title?.substring(0, 20)} {title.length > 20 ? "..." : ""}
      </div>
      <div className="story-title mobile-homepage-story-title">
        {title?.substring(0, 50)} {title.length > 50 ? "..." : ""}
      </div>
      <div className="story-body">
        {body?.substring(0, 70)} {body.length > 70 ? "..." : ""}
      </div>

      <div className="story-details">
        <div className="story-writer-details">
          By &nbsp;
          {writer && (
            <div style={{ color: "#3095FF" }}>
              {writer?.length > 12 ? `${writer.substring(0, 12)}..` : writer}{" "}
              &nbsp;
            </div>
          )}
          | {formatDate()}
        </div>
        <div className="reading-time">
          <svg
            width="19"
            height="12"
            viewBox="0 0 19 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5.26074H6.89"
              stroke="#2B406E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 11.2607H11.043"
              stroke="#2B406E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 8.26074H7.902"
              stroke="#2B406E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 2.26074H6.059"
              stroke="#3095FF"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.3566 5.50298C18.3566 7.98898 16.3406 10.005 13.8546 10.005C11.3676 10.005 9.35156 7.98898 9.35156 5.50298C9.35156 3.01598 11.3676 1.00098 13.8546 1.00098C16.3406 1.00098 18.3566 3.01598 18.3566 5.50298Z"
              stroke="#3095FF"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.7656 3.14551V5.50351L15.0166 6.91451"
              stroke="#2B406E"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            {parseInt(readingTime) === 1 || parseInt(readingTime) === 0
              ? `${parseInt(readingTime)} min Read`
              : `${parseInt(readingTime)} mins Read`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;
