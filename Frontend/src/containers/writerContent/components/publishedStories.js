import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import * as React from "react";
import "./publishedStories.css";
import divider from "../../../Images/divider_line.svg";
import Article from "./Article";
import { getAuthToken } from "../../common/commonFunctions";
import { getArticlesInit } from "./articleActions.js";
import { useDispatch, useSelector } from "react-redux";

const useStyle = makeStyles({
  loadMoreButtonDiv: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    height: "fit-content",
    marginBottom: "2em"
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
    marginBottom: "2em"
  }
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
    setDraftsLoadMoreButtonVisible
  }) => {
    const classes = useStyle();
    const [loadMore, setLoadMore] = useState(false);

    const { articleData, isGettingArticles, btnVisible } = useSelector(
      state => ({
        articleData: state.ArticleData.draftedArticleData,
        isGettingArticles: state.ArticleData.isGettingArticles,
        btnVisible: state.ArticleData.btnVisible
      })
    );

    useEffect(() => {
      fetchArticles(0);
    }, []);

    // const [value, setValue] = useState(false);

    const dispatch = useDispatch();

    const fetchArticles = skip => {
      const authToken = getAuthToken();
      const data = {
        authToken,
        skip: skip,
        limit: 5,
        filters: "DRAFT",
        currentArticles: articleData
      };
      dispatch(getArticlesInit(data));
    };
    return (
      <div className="main-container">
        {/* <img src={divider} className="divider-line" alt="porp" /> */}
        {!isGettingArticles ? (
          <div>
            {articleData.length > 0 ? (
              articleData.map(el => {
                if (!el.deleteAt)
                  return (
                    <div key={el.public.articleId}>
                      <Article
                        data={el}
                        key={el.public.articleId}
                        filters="DRAFT"
                        // forceUpdate={forceUpdate}
                      />
                      <img src={divider} className="divider-line" alt="porp" />
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
              onClick={e => {
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
    setPublishedLoadMoreVisible
  }) => {
    const classes = useStyle();

    const [loadMore, setLoadMore] = useState(false);

    const dispatch = useDispatch();
    const { articleData, isGettingArticles, btnVisible } = useSelector(
      state => ({
        articleData: state.ArticleData.publishedArticleData,
        isGettingArticles: state.ArticleData.isGettingArticles,
        btnVisible: state.ArticleData.btnVisible
      })
    );

    useEffect(() => {
      fetchArticles(0);
    }, []);

    const fetchArticles = skip => {
      const authToken = getAuthToken();
      const data = {
        authToken,
        skip: skip,
        limit: 5,
        filters: "PUBLISHED",
        currentArticles: articleData
      };
      dispatch(getArticlesInit(data));
    };
    return (
      <div className="main-container">
        {/* <img src={divider} className="divider-line" alt="porp" /> */}
        {!isGettingArticles ? (
          <div>
            {articleData.length > 0 ? (
              articleData.map((el, idx) => {
                if (!el.deleteAt)
                  return (
                    <div key={el.public.articleId}>
                      <Article
                        data={el}
                        key={el.public.articleId}
                        filters="PUBLISHED"
                      />{" "}
                      {true && (
                        <img
                          src={divider}
                          className="divider-line"
                          alt="porp"
                        />
                      )}
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
              onClick={e => {
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

//===============================================================================================================
//Draft

// const [Skip, setSkip] = useState(0);
// const [btnVisible, setButtonVisible] = useState(true);
// const [currentNumberOfArticles, setCurrentNumber] = useState(0);

// const destructureCache = cache => {
//   setData(
//     JSON.parse(JSON.stringify(cache)).filter(article => !article.deleteAt)
//   );
//   setIsFetchingData(false);
//   setButtonVisible(draftsLoadMoreButtonVisible);
// };

// useEffect(() => {
//   if (Skip > 0) setLoadMore(true);
//   if (!isDraftsCacheAvailable && !isFetchingDraftsData) {
//     fetchArticles(Skip);
//   } else if (isDraftsCacheAvailable) {
//     destructureCache(draftsCache);
//   }
// }, [Skip]);
// useEffect(() => {
//   console.log("articleData", articleData);
// }, [articleData]);

//       setLoadMore(true);
//       setIsFetchingDraftsData(true);
//
//       const temp = getAuthToken();
//
//       const params = new URLSearchParams({
//         skip: skip,
//         limit: 5,
//         filters: "DRAFT"
//       });
//       axios
//         .get(`${baseURL}/${endPoints.getAllArticles}?${params}`, {
//           headers: {
//             Authorization: temp
//           }
//         })
//         .then(res => {
//           if (res.data.articles.length > 0) {
//             setData(
//               JSON.parse(
//                 JSON.stringify([...articleData, ...res.data.articles])
//               ).filter(article => !article.deleteAt)
//             );
//             setDraftsCache(
//               JSON.parse(
//                 JSON.stringify(draftsCache.concat(res.data.articles))
//               ).filter(article => !article.deleteAt)
//             );
//
//             setButtonVisible(true);
//             setDraftsLoadMoreButtonVisible(true);
//           } else {
//             setDraftsCache(
//               JSON.parse(
//                 JSON.stringify(draftsCache.concat(res.data.articles))
//               ).filter(article => !article.deleteAt)
//             );
//             setButtonVisible(false);
//             setDraftsLoadMoreButtonVisible(false);
//           }
//           setDraftsCacheAvailable(true);
//           setIsFetchingDraftsData(false);
//           setLoadMore(false);
//           setIsFetchingData(false);
//         });

//===============================================================================================================
// PuBLISHED

// const [articleData, setData] = useState([]);
// const [isFetchingData, setIsFetchingData] = useState(true);
// const [btnVisible, setButtonVisible] = useState(false);
// const [Skip, setSkip] = useState(0);

// const destructureCache = cache => {
//   const keys = Object.keys(cache);
//   setData(
//     JSON.parse(JSON.stringify(cache)).filter(article => !article.deleteAt)
//   );
//   setIsFetchingData(false);
//   setButtonVisible(publishedLoadMoreVisible);
// };

//     const forceUpdate = articleId => {
//       articleData.forEach(article => {
//         if (article.articleId === articleId) article.deleteAt = Date.now();
//       });
//
//       setSkip(0);
//
//       const temp = getAuthToken();
//       setPublishedCache([]);
//       const params = new URLSearchParams({
//         skip: 0,
//         limit: articleData.length,
//         filters: "PUBLISHED"
//       });
//       axios
//         .get(`${baseURL}/${endPoints.getAllArticles}?${params}`, {
//           headers: {
//             Authorization: temp
//           }
//         })
//         .then(res => {
//           setData(
//             JSON.parse(JSON.stringify(res.data.articles)).filter(
//               article => !(article.deleteAt || article.articleId === articleId)
//             )
//           );
//           setPublishedCache(
//             JSON.parse(JSON.stringify(res.data.articles)).filter(
//               article => !(article.deleteAt || article.articleId === articleId)
//             )
//           );
//           setLoadMore(false);
//           setPublishedCacheAvailable(true);
//           setIsFetchingPublishedData(false);
//           setIsFetchingData(false);
//         });
//     };

// useEffect(() => {
//   if (Skip > 0) setLoadMore(true);
//   if ((!publishedCacheAvailable && !isFetchingPublishedData) || loadMore) {
//     fetchArticles(Skip);
//   }
//   if (publishedCacheAvailable) {
//     destructureCache(publishedCache);
//   }
// }, [Skip]);
//       setLoadMore(true);
//       setIsFetchingPublishedData(true);
//       const temp = getAuthToken();
//       const params = new URLSearchParams({
//         skip: skip,
//         limit: 5,
//         filters: "PUBLISHED"
//       });
//       axios
//         .get(`${baseURL}/${endPoints.getAllArticles}?${params}`, {
//           headers: {
//             Authorization: temp
//           }
//         })
//         .then(res => {
//           if (res.data.articles.length > 0) {
//             setData(
//               JSON.parse(
//                 JSON.stringify([...articleData, ...res.data.articles])
//               ).filter(article => !article.deleteAt)
//             );
//             setPublishedCache(
//               JSON.parse(
//                 JSON.stringify(publishedCache.concat(res.data.articles))
//               ).filter(article => !article.deleteAt)
//             );
//
//             setButtonVisible(true);
//             setPublishedLoadMoreVisible(true);
//           } else {
//             setButtonVisible(false);
//             setPublishedLoadMoreVisible(false);
//             setPublishedCache(
//               JSON.parse(
//                 JSON.stringify(publishedCache.concat(res.data.articles))
//               ).filter(article => !article.deleteAt)
//             );
//           }
//           setLoadMore(false);
//           setPublishedCacheAvailable(true);
//           setIsFetchingPublishedData(false);
//           setIsFetchingData(false);
//         });
