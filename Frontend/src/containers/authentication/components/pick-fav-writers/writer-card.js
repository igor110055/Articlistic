import { useState, useEffect } from "react";

function WriterCard({ writer, callback }) {
  return (
    <div className="writer-card-container">
      <img
        src={writer.details[0].profilePic}
        alt="writer"
        className="writer-card-writer-img"
      />
      <div className="writer-details">
        <h4 className="writer-name">{writer.details[0].name}</h4>
        <p className="writer-category">{writer.categories[0] || "Politics"}</p>
        <p className="writer-subtitle">{writer.details[0].about}</p>
      </div>
    </div>
  );
}

export default WriterCard;
