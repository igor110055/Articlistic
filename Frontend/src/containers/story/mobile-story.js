import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStoryInit } from "./storyActions";
import { getAuthToken } from "../common/commonFunctions";
import StoryEditor from "./storyEditor";
import WriterDetails from "./mobile-components/writer-details/writer-details";
import MainLoader from "../../components/mainLoader";
import MeaningfulSVG from "../../Images/MeaningfulSVG.svg";
import MobileStorySave from "../../Images/mobile-story-save.svg";
import MobileStoryTwitter from "../../Images/mobile-story-twitter.svg";
import MobileStoryShare from "../../Images/mobile-story-share.svg";
import "./mobile-story.css";
function MobileStory() {
  const { story, isFetchingStory, storyError, storyErrorMsg } = useSelector(
    (state) => ({
      story: state.storyReducer.story,
      isFetchingStory: state.storyReducer.isFetchingStory,
      storyError: state.storyReducer.storyError,
      storyErrorMsg: state.storyReducer.storyErrorMsg,
    })
  );
  //useParams for getting url parameters
  const { articleInfo } = useParams();
  const [articleId, setArticleId] = useState("");
  const [getStoryInitiate, setStoryInitiate] = useState(false);
  const [getStorySuccess, setStorySuccess] = useState(false);
  const [storyBody, setStoryBody] = useState({});
  const [storyData, setStoryData] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    //To get articleId
    //figure of what is the last index of "+" in url and then take substring which is after the last index
    const lastIdxOfPlus = articleInfo.lastIndexOf("+");
    setArticleId(articleInfo.slice(lastIdxOfPlus + 1));
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    //dispatching action for getting articles
    // console.log("story",articleId);
    if (articleId !== "") {
      dispatch(getStoryInit({ articleId, token }));
      setStoryInitiate(true);
    }
  }, [articleId]);

  useEffect(() => {
    if (storyError) {
      setStoryInitiate(false);
      setStorySuccess(false);
      setStoryData({});
    } else {
      if (!isFetchingStory && getStoryInitiate) {
        localStorage.setItem("story", JSON.stringify(story));
        setStoryData(story);
        setStorySuccess(true);
        setStoryBody(JSON.parse(story?.writeup));
      }
    }
  }, [isFetchingStory]);
  const formatDate = (date) => {
    let realDate = date || Date.now();
    var d = new Date(parseInt(realDate, 10));
    var ds = d.toString("MM dd");
    return ds.substring(4, 10);
  };

  return (
    <div className="mobile-story-container">
      {getStorySuccess ? (
        <>
          <img
            className="mobile-article-pic"
            src={story.public.articlePic}
            alt="article-background"
          />

          <div className="mobile-writers-details-div">
            <WriterDetails
              readingTime={storyData.public.readingTime}
              date={formatDate(storyData.public.date)}
              writerName={storyData.public.writerName}
              profilePic={storyData.public.profilePic}
            />
          </div>

          <div className="mobile-social-interaction-div">
            <span className="meaningful-span">
              <img
                src={MeaningfulSVG}
                alt="meaningful"
                className="meaningful-svg"
              />
              <span>Meaningful</span>
              <span className="mobile-meaningful-separator" />
              <span>340</span>
            </span>

            <span>
              <img src={MobileStorySave} alt="save" />
            </span>
            <span>
              <img src={MobileStoryTwitter} alt="twitter" />
            </span>
            <span>
              <img src={MobileStoryShare} alt="share" />
            </span>
          </div>

          <div className="mobile-story-main-content">
            <div className="mobile-story-headers">
              <h4 className="mobile-story-article-name">
                {story.public.title}
              </h4>
              <h5 className="mobile-story-article-subtitle">
                {story.public.body}
              </h5>
            </div>
            <div className="mobile-story-body">
              <StoryEditor storyData={story.writeup} />
            </div>
          </div>
        </>
      ) : (
        <MainLoader />
      )}
    </div>
  );
}

export default MobileStory;
