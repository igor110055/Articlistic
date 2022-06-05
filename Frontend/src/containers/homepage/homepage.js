import React, { useState, useEffect } from "react";
import FollowedWritersPanel from "./writers-panel/followed-writers-panel";
import WriterStoriesComponent from "./writer-stories-component/writer-stories-component";
import "./homepage.css";
import {
  getAuthToken,
  getRefreshToken
  } from "../common/commonFunctions";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import { getWritersandArticles } from "./homepageAction";
import MobileNavbar from "../navbar/mobile-navbar";
import TempNavbar from "../navbar/tempNavbar";
import axios from "axios";import { put, call, takeLatest } from "redux-saga/effects";
import {authGetRequest} from '../../utils/apiRequests';
import { useDispatch } from "react-redux";
function Homepage() {
  const [activeIdx, setActiveIdx] = useState(0);
const dispatch=useDispatch();
  useEffect(() => {
    const fetch = async () => {
      var token = await getAuthToken();  
      dispatch(
        getWritersandArticles({token:token})
      )
      
    };
    fetch();
  }, []);

  return (
    <div>
      <div id="homepage-navbar">
        <TempNavbar />
      </div>
      <FollowedWritersPanel activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
      <WriterStoriesComponent setActiveIdx={setActiveIdx} />
      <div id="mobile-navbar">
        <MobileNavbar />
      </div>
    </div>
  );
}

export default Homepage;
