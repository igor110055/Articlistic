import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getStoryInit } from "./storyActions";
import { getAuthToken } from "../common/commonFunctions";
import { useSelector } from "react-redux";
import StoryCoverPhoto from "./components/storyCoverPhoto";
import MainLoader from "../../components/mainLoader";
import FundCard from "./components/fundCard";
import FundingPerksCard from "./components/fundingPerksCard";
import StoryEditor from "./storyEditor";
import userImage from "../../Images/user-image.png";

import { Box } from "@mui/system";
import { Button, Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TopFunderCard from "./components/topFunderCard";
import NextFunderCard from "./components/nextFunderCard";
import ResponseMenu from "./components/responseMenu";
import EnterWalletPinCard from "../wallet/components/enterWalletPinCard";
import MoreFromWriter from "./components/moreFromWriter";
import ResponseHighlight from "./components/responseHighlight";
import "./story.css";
function Story() {
  const classes = useStyles();
  const { story, isFetchingStory, storyError, storyErrorMsg } = useSelector(
    (state) => ({
      story: state.storyReducer.story,
      isFetchingStory: state.storyReducer.isFetchingStory,
      storyError: state.storyReducer.storyError,
      storyErrorMsg: state.storyReducer.storyErrorMsg,
    })
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [articleId, setArticleId] = useState("");
  const [storyData, setStoryData] = useState({});
  const [getStorySuccess, setStorySuccess] = useState(false);
  const [getStoryInitiate, setStoryInitiate] = useState(false);
  const [storyBody, setStoryBody] = useState({});

  const [isTextSelected, setIsTextSelected] = useState(false);
  const [selectionData, setSelectionData] = useState("");
  const [selectionPosition, setSelectionPosition] = useState(100);
  const [selectedLine, setSelectedLine] = useState("");

  const [sentFunds, setSentFunds] = useState(false);

  const dispatch = useDispatch();
  //useParams for getting url parameters
  const { articleInfo } = useParams();
  useEffect(() => {
    //To get articleId
    //figure of what is the last index of "+" in url and then take substring which is after the last index
    const lastIdxOfPlus = articleInfo.lastIndexOf("+");
    // console.log(lastIdxOfPlus);

    setArticleId(articleInfo.slice(lastIdxOfPlus + 1));
  }, []);

  //Get all occurrences of a string in string
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
    // console.log(wholeText, selectedData);
    const paraArray = wholeText.split(".");
    const textArray = selectedData.split(".");

    paraArray.filter((sentence) => sentence !== undefined);
    textArray.filter((sentence) => sentence !== undefined);
    // console.log("para", paraArray);
    // console.log("text", textArray);
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

    // console.log("i", indicesArray);

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
        // console.log(numDots);
        for (let i = 0; i < idx; i++) {
          offsetOfCurrentSentence += paraArray[i].length;
        }

        const allOccurences = getIndicesOf(
          firstPartOfSelection,
          paraArray[idx]
        );

        // console.log(anchorOffset, offsetOfCurrentSentence);
        allOccurences.map((matchedIdx) => {
          if (anchorOffset === offsetOfCurrentSentence + matchedIdx)
            finalIdx = idx;
        });
        // if (anchorOffset === offsetOfCurrentSentence) finalIdx = idx;
      }
    });

    // console.log(finalIdx);

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
    // console.log(selection);
    let text = selection.toString().trim();
    if (text === "") {
      setIsTextSelected(false);
      setSelectionData("");
    } else {
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

  // useEffect(() => {
  //   console.log("selected Line", selectedLine);
  // }, [selectedLine]);

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
    <div>
      {getStorySuccess ? (
        <div>
          <StoryCoverPhoto
            writerName={storyData.public.writerName}
            body={storyData.public.body}
            title={storyData.public.title}
            articlePic={storyData.public.articlePic}
            readingTime={storyData.public.readingTime}
            date={storyData.public.date}
          />
          <div className={classes.writerInfoContainer}>
            <Box component="span" className={classes.writerInfoName}>
              <Box className={classes.iconNameContainer}>
                <Box sx={{ marginRight: "10px" }}>
                  <img
                    src={userImage}
                    className={classes.writerDisplayIcon}
                    alt="profile"
                  />
                </Box>
                <Box>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "black",
                    }}
                  >
                    {storyData.public.writerName}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#636363",
                      fontWeight: "600",
                    }}
                  >
                    {formatDate(storyData.public.date)} ·{" "}
                    {storyData.public.readingTime} read
                  </div>
                </Box>
              </Box>
              <Box className={classes.rightDummyInfo}>
                <Box className={classes.dummyRightContainer}>
                  <div className={classes.dummySvgContainer}>
                    <svg
                      width="11"
                      height="19"
                      viewBox="0 0 13 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 20L6.17647 16.069L1 20V1H12V20Z"
                        stroke="#2B406E"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <Button
                    sx={{
                      "&.MuiButton-text": { color: "white" },
                      width: "25%",
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: "16px",
                      letterSpacing: "1px",
                      textTransform: "capitalize",
                      background:
                        "linear-gradient(128.16deg, #2B56FF 0%, #1395FD 90.57%)",
                      borderRadius: "10px",
                    }}
                    style={{
                      marginRight: "4%",
                      width: "8rem",
                      height: "3rem",
                    }}
                  >
                    Follow
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
          <div className={classes.cardsContainer}>
            {!isTextSelected && (
              <div className={classes.firstFunderContainer}>
                <div className={classes.funderText}>First Funder</div>
                <TopFunderCard firstFunder />
              </div>
            )}
            {isTextSelected && (
              <div
                style={{
                  marginTop: `max(20vh,calc(${window.scrollY}px - 100vh + 50vh))`,
                  transform: "translateY(-50%)",
                }}
              >
                <ResponseMenu />
              </div>
            )}
            <div className={classes.storyDiv}>
              <div
                className={classes.storyContainer}
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseUp}
              >
                <StoryEditor storyData={storyBody} />
              </div>
            </div>
            {!isTextSelected && (
              <div className={classes.topFunderContainer}>
                <div className={classes.funderText}>Top Funder</div>
                <TopFunderCard />
                <NextFunderCard name="Ayla Adrienne" amount={400} />
                <NextFunderCard name="James Osbert" amount={350} />
                <NextFunderCard name="Diana Rosewood" amount={400} />
              </div>
            )}
            {isTextSelected && (
              <div
                style={{
                  // position: "absolute",
                  marginTop: `max(0vh,calc(${window.scrollY}px - 100vh + 40px)`,
                  // transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FundingPerksCard writerName={storyData.public.writerName} />
                <FundCard
                  writerName={storyData.public.writerName}
                  setIsModalOpen={setIsModalOpen}
                />
              </div>
            )}
          </div>
          <div className="editor-response-separator"></div>
          <div className="response-highlight">
            <ResponseHighlight />
          </div>
          <div>
            <MoreFromWriter
              articleId={articleId}
              writerName={storyData.public.writerName}
            />
          </div>
          <Modal
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSentFunds(false);
            }}
          >
            <div>
              {!sentFunds && (
                <div className="confirmFundsCards">
                  <div className="modal-enter-pin-div">
                    <EnterWalletPinCard />
                  </div>
                  <div className="modal-send-funds-section">
                    <h2 className="modal-send-funds-header">Confirmation</h2>
                    <div className="modal-send-underline"></div>
                    <div className="modal-fund-amount">
                      <span className="modal-fund-amount-bold">Amount:</span>{" "}
                      ₹500.00
                    </div>
                    <div className="modal-available-amount">
                      <span className="modal-fund-amount-bold">Balance:</span>{" "}
                      ₹450.00
                    </div>
                    <button
                      className="modal-fund-anyway-button"
                      onClick={() => setSentFunds(true)}
                    >
                      Send Anyway
                    </button>
                    <div className="modal-send-underline"></div>
                    <div className="modal-fund-button-container">
                      <button className="modal-add-funds-button">
                        Add Funds
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {sentFunds && (
                <div className="sent-funds-card">
                  {/* <img src={ConfettiImage} alt="confetti" className="funding-confetti-image" /> */}
                  <div className="funding-writer-funder-image-div">
                    <img
                      className="funding-writer-image"
                      src={userImage}
                      alt="user"
                    />
                    <img
                      className="funding-writer-image funding-funder-image"
                      src={userImage}
                      alt="user"
                    />
                  </div>
                  <h2 className="funding-sent-message">WooHoo!</h2>
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

export default Story;

const useStyles = makeStyles({
  storyDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  storyContainer: {
    width: "758px",
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  writerInfoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1.4rem",
    mixBlendMode: "normal",
  },

  writerInfoName: {
    border: "1px solid #979797",
    height: "93px",
    width: "758px",
    borderRadius: "20px",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },

  iconNameContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: "20px",
  },

  rightDummyInfo: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: "20px",
  },

  dummySvgContainer: {
    marginRight: "20px",
    borderRadius: "50%",
    border: "1px solid #CECECE",
    width: "39px",
    height: "39px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  dummyRightContainer: {
    marginRight: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  writerDisplayIcon: {
    width: "40px",
    marginTop: "8px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    outline: "3px solid #3BACFC",
    outlineOffset: "-6px",
  },
  cardsContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-around",
    marginTop: "31px",
  },
  firstFunderContainer: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    marginTop: "6px",
  },
  funderText: {
    fontFamily: "Poppins",
    fontWeight: "bolder",
    fontSize: "20px",
    lineHeight: "30px",
    margin: "0",
    marginBottom: "27px",
    /* identical to box height */

    textAlign: "right",
    letterSpacing: "-0.0583333px",
    color: "#000000",
  },
  topFunderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "6px",
  },
  fundingDiv: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
