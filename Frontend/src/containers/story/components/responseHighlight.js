import React from "react";
import "./responseHighlight.css";
import ResponseCard from "./responseCard";
import userImage from "../../../Images/user-image.png";
function ResponseHighlight({ isMobile }) {
  return (
    <div className="response-highlight-container">
      <div className="response-highlight-header-container">
        <div className="response-highlight-circle"></div>
        <h2
          className="response-highlight-header"
          style={isMobile ? { color: "#1A1A1A" } : {}}
        >
          Response Highlight
        </h2>
      </div>
      <ResponseCard
        selection={
          "Negativity bias is a well-known phenomenon in psychology. Adults spend more time looking at negative images than positive ones; t"
        }
        response={{
          profilePic: userImage,
          profileName: "Remya Krishna",
          responseText:
            "This is really a great insight to improve my business.",
        }}
        comments={[
          {
            profilePic: userImage,
            profileName: "Emlen Bever",
            responseText: "Thank You",
          },
        ]}
      />

      <ResponseCard
        selection={`“I am not unhappy now.” The noted moment can then be savored, rather than disappear.`}
        response={{
          profilePic: userImage,
          profileName: "Gopichand Sana",
          responseText: "Awesome!!!",
        }}
      />
    </div>
  );
}

export default ResponseHighlight;
