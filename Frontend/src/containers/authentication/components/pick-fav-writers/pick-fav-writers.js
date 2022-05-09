import { useState } from "react";
import "./pick-fav-writers.css";
import WriterCard from "./writer-card";
import Button from "../primary-button/button";
import Jarret from "../../../../Images/Jarret.png";
import Nathan from "../../../../Images/Nathan.png";
import Ashley from "../../../../Images/Ashley.png";
function PickFavWriters() {
  const tagsData = [
    "All",
    "Technology",
    "Design",
    "Health",
    "Cultures",
    "Sports",
    "Economy",
    "Politics",
  ];

  const writersData = [
    {
      name: "Jarret Cawsey",
      img: Jarret,
      category: "Technology",
      subtitle:
        "Some small decroption about writer goes here just like that and its.",
    },
    {
      name: "Nathan Drake",
      img: Nathan,
      category: "Automotive",
      subtitle:
        "Some small decroption about writer goes here just like that and its.",
    },
    {
      name: "Ashley Graham",
      img: Ashley,
      category: "Politics",
      subtitle:
        "Some small decroption about writer goes here just like that and its.",
    },
  ];
  return (
    <div className="pick-writers-container">
      <h3 className="pick-writers-header">Pick your favourite writers</h3>
      <div className="tags-container">
        {tagsData.map((tag, idx) => (
          <button
            className={`tag-button ${idx === 1 ? "blue-tag" : ""}`}
            key={idx}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="writers-div">
        {writersData.map((writer, idx) => (
          <WriterCard writer={writer} key={idx} />
        ))}
      </div>
      <Button text={"Start Reading"} blue />
    </div>
  );
}

export default PickFavWriters;
