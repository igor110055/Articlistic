import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import AttentiounLogo from "../../../Images/HomepagePublicationSVG.svg";
import { getAuthToken } from "../../common/commonFunctions";
import { getArticlesForPublicationInit } from "../homepageAction";
const Writerpublicationsbutton = ({ publicationData, writer }) => {
  const [activePublication, setActivePublication] = useState("All Stories");
  const dispatch = useDispatch();

  useEffect(() => {
    if (activePublication !== "" && activePublication !== "All Stories") {
      const token = getAuthToken();
      dispatch(
        getArticlesForPublicationInit({
          token,
          writer,
          publicationId: activePublication,
        })
      );
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
