import { useState } from "react";
import "./pick-fav-writers.css";
import WriterCard from "./writer-card";
import Button from "../primary-button/button";
import Jarret from "../../../../Images/Jarret.png";
import Nathan from "../../../../Images/Nathan.png";
import Ashley from "../../../../Images/Ashley.png";
import Margot from "../../../../Images/Margot.png";
import Carl from "../../../../Images/Carl.png";
import Shawn from "../../../../Images/Shawn.png";
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
      name: "Shawn Richards",
      img: Shawn,
      category: "Politics",
      subtitle:
        "Some small decroption about writer goes here just like that and its.",
    },
    {
      name: "Margot Rivera",
      img: Margot,
      category: "Fashion",
      subtitle:
        "Some small decroption about writer goes here just like that and its.",
    },
    {
      name: "Carl Lee",
      img: Carl,
      category: "Politics",
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
      <div className="pick-writers-separator"></div>
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
      <div className="Mobile-button">
        <Button text={"Start Reading"} blue />
      </div>
      <div className="Desktop-buttons">
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

        <div style={{ width: "33%" }}>
          <Button text={"Start Reading"} blue />
        </div>
      </div>
    </div>
  );
}

export default PickFavWriters;
