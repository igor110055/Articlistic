import { useState } from "react";
import TopStoriesCard from "../../writerContent/topStoriesCard";
import AlexTenario from "../../../Images/users/AlexTenario.png";
import Amarachi from "../../../Images/users/Amarachi.png";
import Chandrava from "../../../Images/users/Chandrava.png";
import StoryCard from "../story-card/story-card.js";
import { useDispatch, useSelector } from "react-redux";
import "./writer-stories-component.css";
import Writerpublicationsbutton from "./writer-publications-button";
function WriterStoriesComponent({ setActiveIdx }) {
  const { userlist, message } = useSelector((state) => ({
    // thisState: state,
    userlist: state.homepage.userlist,
    message: state.common.snackbar.message,
  }));

  const writersData = Object.keys(userlist).map((key) => {
    return {
      name: key,
      img: AlexTenario,

      shortName: key.split(" ")[0],
    };
  });
  writersData.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  const publicationData = [
    "All stories",
    "The Weekly",
    "The Time Machine",
    "Culture Study",
    "Blue Print",
    "Crypto Insider",
    "All stories",
    "The Weekly",
    "The Time Machine",
    "Culture Study",
    "Blue Print",
    "Crypto Insider",
  ];

  return (
    <div className="writer-stories-container">
      {writersData.map((writer, idx) => (
        <div
          className="writer-stories-content"
          id={`${writer.name}`}
          key={idx}
          onMouseEnter={() => setActiveIdx(idx)}
        >
          <div className="header">
            <img
              src={writer.img}
              id="homepage-writer-profile-img"
              alt="profile"
              className="profile-pic"
            />
            <h3 className="profile-name">{writer.name}</h3>
            <p
              className="profile-subtitle"
              id="homepage-writer-profile-subtitle"
            >
              (Writes about the insider secrets of the startup world)
            </p>
          </div>
          <div className="publications-nav">
            <Writerpublicationsbutton publicationData={publicationData} />
          </div>
          <div className="writer-stories">
            {userlist[writer.name].articles
              .reverse()
              .slice(0, 4)
              .map((article, idx) => (
                <StoryCard
                  article={article}
                  writer={article.public.writerName}
                  key={idx}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WriterStoriesComponent;
