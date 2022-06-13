import WebStory from "./web-story";
import MobileStory from "./mobile-story";
import useWindowSize from "./useWindowSize";
import "./story.css";

function Story() {
  const size = useWindowSize();

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
