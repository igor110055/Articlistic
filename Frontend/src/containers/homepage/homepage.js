import  { useState, useEffect } from "react";
import FollowedWritersPanel from "./writers-panel/followed-writers-panel";
import WriterStoriesComponent from "./writer-stories-component/writer-stories-component";
import "./homepage.css";
import { getAuthToken } from "../common/commonFunctions";
import { getWritersandArticles } from "./homepageAction";
import MobileNavbar from "../navbar/mobile-navbar";
import TempNavbar from "../navbar/tempNavbar";
import { useDispatch } from "react-redux";
function Homepage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
      var token = getAuthToken();
      dispatch(getWritersandArticles({ token }));
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
