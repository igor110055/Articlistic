// import { Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {  useRef, useState } from "react";
import orange_circle from "../../Images/orange_circle.svg";
import green_circle from "../../Images/green_circle.svg";
import { DraftStories, PublishedStories } from "./components/publishedStories";
const WriterStories = () => {
  const classes = useStyles();
  const [pageToBeDisplayed, setPageToBeDisplayed] = useState("PUBLISHED");
  const [publishedCacheAvailable, setPublishedCacheAvailable] = useState(false);
  const [publishedCache, setPublishedCache] = useState([]);
  const [isFetchingPublishedData, setIsFetchingPublishedData] = useState(false);
  const [isDraftsCacheAvailable, setDraftsCacheAvailable] = useState(false);
  const [draftsCache, setDraftsCache] = useState([]);
  const [isFetchingDraftsData, setIsFetchingDraftsData] = useState(false);
  const [publishedLoadMoreVisible, setPublishedLoadMoreVisible] = useState(
    false
  );
  const [
    draftsLoadMoreButtonVisible,
    setDraftsLoadMoreButtonVisible
  ] = useState(false);
  const ref = useRef(null);

  return (
    <div className={classes.container}>
      <div className={classes.mainPage}>
        <div className={classes.Tabs}>
          <div
            className={
              pageToBeDisplayed === "PUBLISHED"
                ? classes.SelectedPublishedstories
                : classes.Publishedstories
            }
            onClick={e => {
              setPageToBeDisplayed("PUBLISHED");
            }}
          >
            <img className={classes.img_class} src={green_circle} alt="img" />
            Published
          </div>
          <div
            className={
              pageToBeDisplayed === "DRAFTS"
                ? classes.SelectedPublishedstories
                : classes.Publishedstories
            }
            onClick={e => {
              setPageToBeDisplayed("DRAFTS");
            }}
          >
            <img className={classes.img_class} src={orange_circle} alt="img" />
            Drafts
          </div>
        </div>

        {pageToBeDisplayed === "PUBLISHED" ? (
          <PublishedStories
            publishedCache={publishedCache}
            publishedCacheAvailable={publishedCacheAvailable}
            isFetchingPublishedData={isFetchingPublishedData}
            setPublishedCache={setPublishedCache}
            setPublishedCacheAvailable={setPublishedCacheAvailable}
            setIsFetchingPublishedData={setIsFetchingPublishedData}
            publishedLoadMoreVisible={publishedLoadMoreVisible}
            setPublishedLoadMoreVisible={setPublishedLoadMoreVisible}
          />
        ) : (
          <DraftStories
            draftsCache={draftsCache}
            isDraftsCacheAvailable={isDraftsCacheAvailable}
            isFetchingDraftsData={isFetchingDraftsData}
            setDraftsCache={setDraftsCache}
            setDraftsCacheAvailable={setDraftsCacheAvailable}
            setIsFetchingDraftsData={setIsFetchingDraftsData}
            draftsLoadMoreButtonVisible={draftsLoadMoreButtonVisible}
            setDraftsLoadMoreButtonVisible={setDraftsLoadMoreButtonVisible}
          />
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  Tabs: {
    display: "flex",
    marginTop: "3em",
    marginLeft: "130px"
  },

  container: {
    width: "100vw",
    minHeight: "100vh",
    border: "0.1px solid white",

    backgroundColor: "#F6F6F7"
  },
  Publishedstories: {
    padding: "1em",
    fontFamily: "Poppins",
    fontSize: "1.1em",
    color: "rgba(49, 61, 124, 1)",
    fontWeight: "700",
    cursor: "pointer"
  },
  img_class: {
    verticalAlign: "middle",
    marginRight: "0.8em"
  },
  mainPage: {
    // marginLeft: "5em"
  },
  SelectedPublishedstories: {
    padding: "1em",
    fontFamily: "Poppins",
    fontSize: "1.1em",
    color: "rgba(49, 61, 124, 1)",
    fontWeight: "700",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    borderRadius: "20px 20px 0px 0px"
  }
});

export default WriterStories;
