import React from "react";

function WriterCard({ writer }) {
  return (
    <div className="writer-card-container">
      <img src={writer.img} alt="writer" className="writer-card-writer-img" />
      <div className="writer-details">
        <h4 className="writer-name">{writer.name}</h4>
        <p className="writer-category">{writer.category}</p>
        <p className="writer-subtitle">{writer.subtitle}</p>
      </div>
    </div>
  );
}

export default WriterCard;
