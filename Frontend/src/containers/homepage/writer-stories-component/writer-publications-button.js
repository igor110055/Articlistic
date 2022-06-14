import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import AttentiounLogo from "../../../Images/HomepagePublicationSVG.svg";
import { getAuthToken } from "../../common/commonFunctions";
import {
  getArticlesForPublicationInit,
  getLatestArticlesForWriterInit,
} from "../homepageAction";
const Writerpublicationsbutton = ({ publicationData, writer }) => {
  const [activePublication, setActivePublication] = useState("All Stories");
  const [once, setOnce] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (once) {
      if (activePublication !== "") {
        const token = getAuthToken();
        if (activePublication !== "All Stories") {
          dispatch(
            getArticlesForPublicationInit({
              token,
              writer,
              publicationId: activePublication,
            })
          );
        } else {
          dispatch(
            getLatestArticlesForWriterInit({
              token,
              writer,
            })
          );
        }
      }
    }
  }, [activePublication]);

  return (
    <>
      <button
        className={`publication-button ${
          activePublication === "All Stories" ? "active-publication" : ""
        }`}
        onClick={() => {
          setActivePublication("All Stories");
        }}
      >
        <img src={AttentiounLogo} alt="" className="publication-icon" />
        <span className="publication-span">All Stories</span>
      </button>
      {publicationData.map((publication, idx) => (
        <button
          key={idx}
          className={`publication-button ${
            activePublication === publication.publicationId
              ? "active-publication"
              : ""
          }`}
          onClick={() => {
            setActivePublication(publication.publicationId);
            setOnce(true);
          }}
        >
          <img
            src={publication.publicationPic || AttentiounLogo}
            alt=""
            className="publication-icon"
          />
          <span className="publication-span">
            {publication.publicationName}
          </span>
        </button>
      ))}
    </>
  );
};

export default Writerpublicationsbutton;
