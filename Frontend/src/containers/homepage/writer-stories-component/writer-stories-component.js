import { useState } from "react";
import TopStoriesCard from "../../writerContent/topStoriesCard";
import AlexTenario from "../../../Images/users/AlexTenario.png";
import Amarachi from "../../../Images/users/Amarachi.png";
import Chandrava from "../../../Images/users/Chandrava.png";
import StoryCard from "../story-card/story-card.js";
import { ReactComponent as AttentiounLogo } from "../../../Images/HomepagePublicationSVG.svg";
import "./writer-stories-component.css";
function WriterStoriesComponent({ setActiveIdx }) {
  const [activePublication, setActivePublication] = useState("All Stories");

  const article = {
    public: {
      articlePic:
        "https://images.unsplash.com/photo-1610072947120-8736bbfc56e1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODAwNTV8MHwxfHNlYXJjaHwxfHxmb3VyfGVufDB8fHx8MTY0OTUwNjQxOA&ixlib=rb-1.2.1&q=85",
      body:
        "BNPL solutions allow customers to spread out the cost of their purchases...",
      date: 1649771892446,
      readingTime: "1 min",
      title: "What Next for ‘Buy Now, Pay Later’ Companies?",
      writerName: "yashchaudhari"
    }
  };
  const writersData = [
    {
      name: "Alex Tenario",
      img: AlexTenario,
      shortName: "Alex"
    },
    {
      name: "Amarachi",
      img: Amarachi,
      shortName: "Amarachi"
    },
    {
      name: "Chandrava",
      img: Chandrava,
      shortName: "Chandrava"
    }
  ];

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
    "Crypto Insider"
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
            {publicationData.map((publication, idx) => (
              <button
                key={idx}
                className={`publication-button ${
                  activePublication === publication ? "active-publication" : ""
                }`}
                onClick={() => setActivePublication(publication)}
              >
                <AttentiounLogo />
                <span className="publication-span">{publication}</span>
              </button>
            ))}
          </div>
          <div className="writer-stories">
            <StoryCard article={article} writer="yash" />
            <StoryCard article={article} writer="yash" />
            <StoryCard article={article} writer="yash" />
            <StoryCard article={article} writer="yash" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default WriterStoriesComponent;