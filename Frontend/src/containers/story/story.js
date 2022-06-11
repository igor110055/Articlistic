import WebStory from "./web-story";
import MobileStory from "./mobile-story";
import "./story.css";
function Story() {
  return (
    <>
      <div className="web-story">
        <WebStory />
      </div>
      <div className="mobile-story">
        <MobileStory />
      </div>
    </>
  );
}

export default Story;
