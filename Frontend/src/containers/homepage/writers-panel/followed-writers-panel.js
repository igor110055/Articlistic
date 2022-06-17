import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as AttentiounLogo } from "../../../Images/logo.svg";
import userImage from "../../../Images/user-image.png";
import "./followed-writers-panel.css";
import { setActiveIdxData } from "../homepageAction";
import { useLocation, useNavigate } from "react-router";

function FollowedWritersPanel() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // console.log("location", location);
  const { userlist, message, activeIdx } = useSelector((state) => ({
    // thisState: state,
    userlist: state.homepage.userlist,
    message: state.common.snackbar.message,
    activeIdx: state.homepage.activeIdx,
  }));
  const writersData = Object.keys(userlist).map((key) => {
    return {
      name: key,
      img: userlist[key].userData.profilePic,
      shortName: key.split(" ")[0],
    };
  });
  writersData.sort((a, b) => a.name.localeCompare(b.name));

  const handleWriterPanelClick = (idx) => {
    console.log(location.pathname.split("#")[0]);
    if (location.pathname.split("#")[0] === "/homepage") {
      dispatch(setActiveIdxData({ activeIdx: idx }));
    } else {
      navigate("/homepage");
      dispatch(setActiveIdxData({ activeIdx: idx }));
    }
  };
  return (
    <div className="writers-panel-container">
      <div className="followed-writers">
        <AttentiounLogo id="attentioun-logo" className="attentioun-logo" />
        <Link to="/aloo-by-virenoswall/The-Great-Online-Game+70c0aef2-2c80-45dc-8fa3-cf4b3b0e126e">
          <span
            style={{
              backgroundColor: "black",
            }}
          >
            Story
          </span>
        </Link>
        <div id="logo-separator" className="logo-separator-div" />
        {writersData.map((writer, idx) => (
          <a
            className="writer"
            href={`#${writer.name}`}
            onClick={() => handleWriterPanelClick(idx)}
            id={`this-${writer.name}`}
            key={idx}
          >
            <div className="writer-profile-pic-container">
              {idx === activeIdx && <div className="active-writer"></div>}
              {idx !== activeIdx && (
                <div className="active-writer non-active-writer"></div>
              )}
              <div className="writer-profile-icons">
                <img
                  src={writer.img || userImage}
                  className="writer-profile-pic"
                  alt="writer"
                />
                <div className="online-svg-container">
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.0469 8.06739C15.0469 11.819 12.0056 14.8604 8.25391 14.8604C4.50226 14.8604 1.46094 11.819 1.46094 8.06739C1.46094 4.31573 4.50226 1.27441 8.25391 1.27441C12.0056 1.27441 15.0469 4.31573 15.0469 8.06739Z"
                      fill="#59B5FF"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <p className="writer-profile-name">{writer.shortName}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default FollowedWritersPanel;
