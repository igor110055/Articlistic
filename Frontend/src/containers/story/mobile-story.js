import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStoryInit } from "./storyActions";
import { getAuthToken } from "../common/commonFunctions";
import StoryEditor from "./storyEditor";
import WriterDetails from "./mobile-components/writer-details/writer-details";
import MainLoader from "../../components/mainLoader";
import AttentiounLogo from "../../Images/logo.svg";
import MeaningfulSVG from "../../Images/MeaningfulSVG.svg";
import MobileStorySave from "../../Images/mobile-story-save.svg";
import MobileStoryTwitter from "../../Images/mobile-story-twitter.svg";
import MobileStoryShare from "../../Images/mobile-story-share.svg";
import ResponseHighlight from "./components/responseHighlight";
import { Modal } from "@mui/material";
import MobileResponseMenu from "./mobile-components/mobile-response-menu/mobile-response-menu";
import "./mobile-story.css";
import TopFunderCard from "./components/topFunderCard";
import MobileStoryNavbar from "./mobile-components/mobile-story-navbar/mobile-story-navbar";
import userImage from "../../Images/user-image.png";
import EnterWalletPinCard from "../wallet/components/enterWalletPinCard";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isTextSelected, setIsTextSelected] = useState(false);
  const [selectionData, setSelectionData] = useState("");
  const [selectionPosition, setSelectionPosition] = useState(100);
  const [selectedLine, setSelectedLine] = useState("");
  const [isFundModalOpen, setFundModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [sentFunds, setSentFunds] = useState(false);
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

  function getIndicesOf(searchStr, str) {
    var searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
      return [];
    }
    var startIndex = 0,
      index,
      indices = [];

    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }

  const extractLineFromParagraph = (wholeText, selectedData, anchorOffset) => {
    if (!wholeText || !selectedData) return "";

    selectedData = selectedData.replace(/^\.+|\.+$/g, "");
    const paraArray = wholeText.split(".");
    const textArray = selectedData.split(".");

    paraArray.filter((sentence) => sentence !== undefined);
    textArray.filter((sentence) => sentence !== undefined);
    let indicesArray = [];

    let firstPartOfSelection;

    // For cases where few first elements of textArray are undefined
    let j = 0;
    while (j < textArray.length && textArray[j] === "") j++;

    if (j === textArray.length) return "";
    else firstPartOfSelection = textArray[j];

    paraArray.forEach((sentence, idx) => {
      if (sentence.includes(firstPartOfSelection)) indicesArray.push(idx);
    });

    //number of full stops before anchorOffset
    let numDots = 0;
    for (let i = 0; i < anchorOffset; i++) if (wholeText[i] === ".") numDots++;
    let finalIdx = -1;

    indicesArray.forEach((idx) => {
      let foundSentences = true;

      for (let i = 1; i < textArray.length - 1; i++) {
        if (paraArray[idx + i] !== textArray[i]) foundSentences = false;
      }

      if (textArray.length !== 1) {
        if (
          paraArray[idx].endsWith(textArray[0]) === false ||
          paraArray[idx + textArray.length - 1]?.startsWith(
            textArray[textArray.length - 1] === false
          )
        ) {
          foundSentences = false;
        }
      }

      if (foundSentences) {
        let offsetOfCurrentSentence = numDots;
        for (let i = 0; i < idx; i++) {
          offsetOfCurrentSentence += paraArray[i].length;
        }

        const allOccurences = getIndicesOf(
          firstPartOfSelection,
          paraArray[idx]
        );

        allOccurences.forEach((matchedIdx) => {
          if (anchorOffset === offsetOfCurrentSentence + matchedIdx)
            finalIdx = idx;
        });
        // if (anchorOffset === offsetOfCurrentSentence) finalIdx = idx;
      }
    });

    let containingText;

    for (let i = 0; i < textArray.length; i++) {
      if (
        paraArray[i + finalIdx] !== undefined &&
        paraArray[i + finalIdx] !== ""
      ) {
        if (containingText !== undefined)
          containingText += paraArray[i + finalIdx] + ".";
        else containingText = paraArray[i + finalIdx] + ".";
      }
    }

    console.log(containingText);
    return containingText?.trim();
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    let text = selection.toString().trim();
    if (text === "") {
      setIsTextSelected(false);
      setSelectionData("");
    } else {
      setIsModalOpen(true);
      setIsTextSelected(true);
      setSelectionData(text);
      setSelectedLine(
        extractLineFromParagraph(
          selection?.baseNode?.wholeText?.toString()?.trim(),
          selection.toString(),
          selection.anchorOffset
        )
      );
      let rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectionPosition((rect.top + rect.bottom) / 2);
    }
  };

  const handleTouch = (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    let text = selection.toString().trim();
    if (text === "") {
      setIsTextSelected(false);
      setSelectionData("");
    } else {
      setIsModalOpen(true);
      setIsTextSelected(true);
      setSelectionData(text);
      setSelectedLine(
        extractLineFromParagraph(
          selection?.baseNode?.wholeText?.toString()?.trim(),
          selection.toString(),
          selection.anchorOffset
        )
      );
      let rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectionPosition((rect.top + rect.bottom) / 2);
    }
  };

  return (
    <div className="mobile-story-container ">
      {getStorySuccess ? (
        <div>
          <MobileStoryNavbar
            publicationName={"Emlen & Co."}
            publicationLogo={AttentiounLogo}
          />
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

          <div
            className="mobile-social-interaction-div tabs-social-interaction-div"
            style={{ marginTop: "-1rem" }}
          >
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
            <div className="mobile-story-funder-cards">
              <TopFunderCard />
              <TopFunderCard firstFunder />
            </div>

            <div
              className="mobile-story-body"
              onTouchEnd={(e) => handleTouch(e)}
              onMouseUp={handleMouseUp}
              onMouseDown={handleMouseUp}
            >
              <StoryEditor storyData={storyBody} />
            </div>
          </div>
          <div className="mobile-story-bottom">
            <ResponseHighlight isMobile />
          </div>
          <Modal
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={isModalOpen}
            // open={true}
            onClose={() => {
              setIsModalOpen(false);
            }}
          >
            <MobileResponseMenu
              writerName={storyData.public.writerName}
              profilePic={storyData.public.profilePic}
              setFundModalOpen={setFundModalOpen}
            />
          </Modal>
          <Modal
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            open={isFundModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSentFunds(false);
            }}
          >
            <div>
              {!sentFunds && (
                <div className="mobile-story-confirmFundsCards">
                  <div className="mobile-story-modal-enter-pin-div">
                    <EnterWalletPinCard />
                  </div>
                  <div className="mobile-story-modal-send-funds-section">
                    <div className="mobile-story-modal-send-underline"></div>
                    <div className="mobile-story-modal-fund-amount">
                      <span className="mobile-story-modal-fund-amount-bold">
                        Amount:
                      </span>{" "}
                      ₹500.00
                    </div>
                    <div className="mobile-story-modal-available-amount">
                      <span className="mobile-story-modal-fund-amount-bold">
                        Balance:
                      </span>{" "}
                      ₹450.00
                    </div>
                    <button
                      className="mobile-story-modal-fund-anyway-button"
                      onClick={() => setSentFunds(true)}
                    >
                      Send Anyway
                    </button>
                    <div className="mobile-story-modal-send-underline"></div>
                    <div className="mobile-story-modal-fund-button-container">
                      <button className="mobile-story-modal-add-funds-button">
                        Add Funds
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {sentFunds && (
                <div className="mobile-story-sent-funds-card">
                  {/* <img src={ConfettiImage} alt="confetti" className="funding-confetti-image" /> */}
                  <div className="mobile-story-funding-writer-funder-image-div">
                    <img
                      className="mobile-story-funding-writer-image"
                      src={userImage}
                      alt="user"
                    />
                    <img
                      className="mobile-story-funding-writer-image mobile-story-funding-funder-image"
                      src={userImage}
                      alt="user"
                    />
                  </div>
                  <h2 className="mobile-story-funding-sent-message">WooHoo!</h2>
                  <p className="mobile-story-funding-sent-text">
                    You have successfully funded ₹450 to Emlen Beaver.
                  </p>
                  <div className="mobile-story-funding-sent-button-div">
                    <button className="mobile-story-funding-sent-share-button">
                      Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        </div>
      ) : (
        <MainLoader />
      )}
    </div>
  );
}

export default MobileStory;
