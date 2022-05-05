import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import * as React from "react";
import axios from "axios";
import crypto from "crypto-js";
import { baseURL, endPoints } from "../../../utils/apiEndPoints";
import Cookie from "js-cookie";
import "./publishedStories.css";
import divider from "../../../Images/divider_line.svg";
import Article from "./Article";
import { getAuthToken } from "../../common/commonFunctions";
const useStyle = makeStyles({
  loadMoreButtonDiv: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    height: "fit-content",
    marginBottom: "2em",
  },
  loadMoreButton: {
    padding: "1em",
    background: " linear-gradient(128.16deg, #2B56FF 0%, #1395FD 90.57%)",
    fontSize: "1em",

    fontFamily: "Poppins",
    borderRadius: "10px",
    color: "white",
    border: "none !important",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "2em",
  },
});

export const DraftStories = React.memo(
  ({
    draftsCache,
    isDraftsCacheAvailable,
    isFetchingDraftsData,
    setDraftsCache,
    setDraftsCacheAvailable,
    setIsFetchingDraftsData,
    draftsLoadMoreButtonVisible,
    setDraftsLoadMoreButtonVisible,
  }) => {
    const classes = useStyle();
    const [articleData, setData] = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [Skip, setSkip] = useState(0);
    const [loadMore, setLoadMore] = useState(false);
    const [btnVisible, setButtonVisible] = useState(false);
    const destructureCache = (cache) => {
      const keys = Object.keys(cache);
      setData(JSON.parse(JSON.stringify(cache)));
      setIsFetchingData(false);
      setButtonVisible(draftsLoadMoreButtonVisible);
    };

    useEffect(() => {
      if (Skip > 0) setLoadMore(true);
      if (!isDraftsCacheAvailable && !isFetchingDraftsData) {
        fetchArticles(Skip);
      } else if (isDraftsCacheAvailable) {
        destructureCache(draftsCache);
      }
    }, [Skip]);

    const fetchArticles = (skip) => {
      setLoadMore(true);
      setIsFetchingDraftsData(true);

      const temp = getAuthToken();

      const params = new URLSearchParams({
        skip: skip,
        limit: 5,
        filters: "DRAFT",
      });
      axios
        .get(`${baseURL}/${endPoints.getAllArticles}?${params}`, {
          headers: {
            Authorization: temp,
          },
        })
        .then((res) => {
          if (res.data.articles.length > 0) {
            setData(
              JSON.parse(JSON.stringify([...articleData, ...res.data.articles]))
            );
            setDraftsCache(
              JSON.parse(JSON.stringify(draftsCache.concat(res.data.articles)))
            );

            setButtonVisible(true);
            setDraftsLoadMoreButtonVisible(true);
          } else {
            setDraftsCache(
              JSON.parse(JSON.stringify(draftsCache.concat(res.data.articles)))
            );
            setButtonVisible(false);
            setDraftsLoadMoreButtonVisible(false);
          }
          setDraftsCacheAvailable(true);
          setIsFetchingDraftsData(false);
          setLoadMore(false);
          setIsFetchingData(false);
        });
    };
    return (
      <div className="main-container">
        <img src={divider} className="divider-line" />
        {!isFetchingData ? (
          <div>
            {articleData.length > 0 ? (
              articleData.map((el) => {
                return (
                  <div>
                    <Article data={el} key={el.public.articleId} />{" "}
                    <img src={divider} className="divider-line" />
                  </div>
                );
              })
            ) : (
              <p className="no-article-msg">Currently you have no Drafts 📜</p>
            )}
            {loadMore ? (
              <div className="progress-div">
                <CircularProgress size={20} />
              </div>
            ) : (
              <span />
            )}
          </div>
        ) : (
          <div className="progress-div">
            <CircularProgress size={20} />
          </div>
        )}
        {btnVisible ? (
          <div className={classes.loadMoreButtonDiv}>
            <button
              className={classes.loadMoreButton}
              onClick={(e) => {
                fetchArticles(articleData.length);
              }}
            >
              Load More
            </button>
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }
);

export const PublishedStories = React.memo(
  ({
    publishedCache,
    publishedCacheAvailable,
    isFetchingPublishedData,
    setPublishedCache,
    setPublishedCacheAvailable,
    setIsFetchingPublishedData,
    publishedLoadMoreVisible,
    setPublishedLoadMoreVisible,
  }) => {
    const classes = useStyle();
    const [articleData, setData] = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [btnVisible, setButtonVisible] = useState(false);
    const [Skip, setSkip] = useState(0);
    const [loadMore, setLoadMore] = useState(false);
    const destructureCache = (cache) => {
      const keys = Object.keys(cache);
      setData(JSON.parse(JSON.stringify(cache)));
      setIsFetchingData(false);
      setButtonVisible(publishedLoadMoreVisible);
    };

    useEffect(() => {
      if (Skip > 0) setLoadMore(true);
      if ((!publishedCacheAvailable && !isFetchingPublishedData) || loadMore) {
        fetchArticles(Skip);
      }
      if (publishedCacheAvailable) {
        destructureCache(publishedCache);
      }
    }, [Skip]);

    const fetchArticles = (skip) => {
      setLoadMore(true);
      setIsFetchingPublishedData(true);
      const temp = getAuthToken();
      const params = new URLSearchParams({
        skip: skip,
        limit: 5,
        filters: "PUBLISHED",
      });
      axios
        .get(`${baseURL}/${endPoints.getAllArticles}?${params}`, {
          headers: {
            Authorization: temp,
          },
        })
        .then((res) => {
          if (res.data.articles.length > 0) {
            setData(
              JSON.parse(JSON.stringify([...articleData, ...res.data.articles]))
            );
            setPublishedCache(
              JSON.parse(
                JSON.stringify(publishedCache.concat(res.data.articles))
              )
            );

            setButtonVisible(true);
            setPublishedLoadMoreVisible(true);
          } else {
            setButtonVisible(false);
            setPublishedLoadMoreVisible(false);
            setPublishedCache(
              JSON.parse(
                JSON.stringify(publishedCache.concat(res.data.articles))
              )
            );
          }
          setLoadMore(false);
          setPublishedCacheAvailable(true);
          setIsFetchingPublishedData(false);
          setIsFetchingData(false);
        });
    };
    return (
      <div className="main-container">
        <img src={divider} className="divider-line" />
        {!isFetchingData ? (
          <div>
            {articleData.length > 0 ? (
              articleData.map((el) => {
                return (
                  <div>
                    <Article data={el} key={el.public.articleId} />{" "}
                    <img src={divider} className="divider-line" />
                  </div>
                );
              })
            ) : (
              <p className="no-article-msg">
               Currently you have no Published Stories 👀
              </p>
            )}
            {loadMore ? (
              <div className="progress-div">
                <CircularProgress size={20} />
              </div>
            ) : (
              <span />
            )}
          </div>
        ) : (
          <div className="progress-div">
            <CircularProgress size={20} />
          </div>
        )}
        {btnVisible ? (
          <div className={classes.loadMoreButtonDiv}>
            <button
              className={classes.loadMoreButton}
              onClick={(e) => {
                fetchArticles(articleData.length);
              }}
            >
              Load More
            </button>
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }
);
