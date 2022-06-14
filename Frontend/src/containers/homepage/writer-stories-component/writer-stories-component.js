import { useState } from "react";
import StoryCard from "../story-card/story-card.js";
import { useSelector } from "react-redux";
import Writerpublicationsbutton from "./writer-publications-button";

import "./writer-stories-component.css";
function WriterStoriesComponent({ setActiveIdx }) {
  const { userlist, message } = useSelector((state) => ({
    // thisState: state,
    userlist: state.homepage.userlist,
    message: state.common.snackbar.message,
  }));
  const publicationsMap = {};

  Object.keys(userlist).forEach((key) => {
    userlist[key].userData.publications.forEach((publication) => {
      publicationsMap[publication.publicationId] = publication.publicationName;
    });
  });
  // console.log(publicationsMap);
  const writersData = Object.keys(userlist).map((key) => {
    return {
      name: key,
      img: userlist[key].userData.profilePic,
      shortName: key.split(" ")[0],
      profileName: userlist[key].userData.name,
      publications: userlist[key].userData.publications,
    };
  });
  writersData.sort((a, b) => a.name.localeCompare(b.name));

  const makeUrlForArticle = (article) => {
    let name = article.public.title.split(" ");
    let urlName = name.join("-");
    return `/${publicationsMap[article.publicationId]}-by-${
      article.public.writerName
    }/${urlName}+${article.articleId}`;
  };
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
            <h3 className="profile-name">{writer.profileName}</h3>
            <p
              className="profile-subtitle"
              id="homepage-writer-profile-subtitle"
            >
              (Writes about the insider secrets of the startup world)
            </p>
          </div>
          {writer.publications.length > 0 && (
            <div className="publications-nav">
              <Writerpublicationsbutton
                publicationData={writer.publications}
                writer={writer.name}
              />
            </div>
          )}
          <div className="writer-stories">
            {userlist[writer.name].articles.map((article, idx) => (
              <StoryCard
                article={article}
                writer={article.public.writerName}
                key={idx}
                url={makeUrlForArticle(article)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WriterStoriesComponent;
