import React, { useState } from "react";
import AlexTenario from "../../../Images/users/AlexTenario.png";
import Amarachi from "../../../Images/users/Amarachi.png";
import Chandrava from "../../../Images/users/Chandrava.png";
import Dontae from "../../../Images/users/Dontae.png";
import HuHyon from "../../../Images/users/HuHyon-Suk.png";
import IvanPolo from "../../../Images/users/IvanPolo.png";
import Jordanna from "../../../Images/users/Jordanna.png";
import LilahiLoselev from "../../../Images/users/LilahLoselev.png";
import Lumir from "../../../Images/users/Lumir.png";
import Stephanus from "../../../Images/users/Stephanus.png";
import UesugiSuzuki from "../../../Images/users/UesugiSuzuki.png";
import YiChunHwa from "../../../Images/users/YiChun-Hwa.png";

import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as AttentiounLogo } from "../../../Images/logo.svg";

import "./followed-writers-panel.css";

function FollowedWritersPanel({ activeIdx, setActiveIdx }) {
  const { userlist, message } = useSelector((state) => ({
    // thisState: state,
    userlist: state.homepage.userlist,
    message: state.common.snackbar.message,
  }));
  const writersData =  Object.keys(userlist).map((key) => {
    return {
      name: key,
      img: AlexTenario,
      shortName: key.split(" ")[0],
    };
  })



  // [
  //   {
  //     name: "Alex Tenario",
  //     img: AlexTenario,
  //     shortName: "Alex"
  //   },
  //   {
  //     name: "Amarachi",
  //     img: Amarachi,
  //     shortName: "Amarachi"
  //   },
  //   {
  //     name: "Chandrava",
  //     img: Chandrava,
  //     shortName: "Chandrava"
  //   },
  //   {
  //     name: "Dontae",
  //     img: Dontae,
  //     shortName: "Dontae"
  //   },
  //   {
  //     name: "Hu Hyon-Suk",
  //     img: HuHyon,
  //     shortName: "Hyon-Suk"
  //   },
  //   {
  //     name: "Ivan Polo",
  //     img: IvanPolo,
  //     shortName: "Ivan"
  //   },
  //   {
  //     name: "Jordanna",
  //     img: Jordanna,
  //     shortName: "Jordanna"
  //   },
  //   {
  //     name: "Lilahi Loselev",
  //     img: LilahiLoselev,
  //     shortName: "Lilahi"
  //   },
  //   {
  //     name: "Lumir",
  //     img: Lumir,
  //     shortName: "Lumir"
  //   },
  //   {
  //     name: "Stephanus",
  //     img: Stephanus,
  //     shortName: "Stephanus"
  //   },
  //   {
  //     name: "Uesugi Suzuki",
  //     img: UesugiSuzuki,
  //     shortName: "Uesugi"
  //   },
  //   {
  //     name: "Yi Chun-Hwa",
  //     img: YiChunHwa,
  //     shortName: "Chun-Hwa"
  //   }
  // ];
  return (
    <div className="writers-panel-container">
      <div className="followed-writers">
        <AttentiounLogo id="attentioun-logo" className="attentioun-logo" />
        <div id="logo-separator" className="logo-separator-div" />
        {writersData.map((writer, idx) => (
          <a
            className="writer"
            href={`#${writer.name}`}
            onClick={() => setActiveIdx(idx)}
            id={`this-${writer.name}`}
          >
            <div className="writer-profile-pic-container">
              {idx === activeIdx && <div className="active-writer"></div>}
              {idx !== activeIdx && (
                <div className="active-writer non-active-writer"></div>
              )}
              <div className="writer-profile-icons">
                <img
                  src={writer.img}
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
                      stroke-width="2"
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
