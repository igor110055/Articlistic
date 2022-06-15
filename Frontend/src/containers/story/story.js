import { useEffect } from "react";
import { useDispatch } from "react-redux";
import WebStory from "./web-story";
import MobileStory from "./mobile-story";
import useWindowSize from "./useWindowSize";
import "./story.css";
import { getWritersandArticles } from "../homepage/homepageAction";
import { getAuthToken } from "../common/commonFunctions";

function Story() {
  const dispatch = useDispatch();
  const size = useWindowSize();
  useEffect(() => {
    var token = getAuthToken();
    dispatch(getWritersandArticles({ token }));
  }, []);

  return (
    <div>
      {size > 1000 ? (
        <div className="web-story">
          <WebStory />
        </div>
      ) : (
        <div className="mobile-story">
          <MobileStory />
        </div>
      )}
    </div>
  );
}

export default Story;
