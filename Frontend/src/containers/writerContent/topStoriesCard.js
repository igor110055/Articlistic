import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookmarkArticle } from "../../containers/home/homeActions";
// import graphPNG from "./../../Images/graph.png";
// import Cookie from "js-cookie";
// import crypto from "crypto-js";
// import { Button, Dialog, DialogTitle, CircularProgress } from "@mui/material";
import { getAuthToken } from "../common/commonFunctions";

const TopStoriesCard = ({ article, writer }) => {
  const [bookmarkInitiate, setBookmarkInitiate] = useState(false);
  const [bookmarkDone, setBookmarkDone] = useState(false);
  // const [openBookmarkDialog, setOpenBookmarkDialog] = useState(false);
  const classes = useStyles();
  const {
    articlePic,
    readingTime,
    // writerName,
    body,
    date,
    title
  } = article.public;
  const dispatch = useDispatch();
  const {
    isBookmarkingArticle,
    bookmarkArticleError
    // bookmarkArticleErrorMsg,
    // bookmarkArticleResp
  } = useSelector(state => ({
    isBookmarkingArticle: state.home.isBookmarkingArticle,
    bookmarkArticleError: state.home.bookmarkArticleError,
    bookmarkArticleErrorMsg: state.home.bookmarkArticleErrorMsg,
    bookmarkArticleResp: state.home.bookmarkArticleResp
  }));

  useEffect(() => {
    if (bookmarkArticleError) {
      setBookmarkDone(false);
    } else {
      if (!isBookmarkingArticle && bookmarkInitiate) {
        setBookmarkDone(true);
      }
    }
  }, [isBookmarkingArticle]);

  /**
   * *This function is used to bookmark an article. It takes in an articleId and a token. It then
   * dispatches the bookmarkArticle action creator with the articleId and token as arguments. It also
   * sets the bookmarkInitiate state to true.*
   */
  const handleBookmark = () => {
    const temp = getAuthToken();
    dispatch(
      bookmarkArticle(
        {
          // articleId: "f1b9db36-0756-47e9-b95a-89f2d18ec5c4",
        },
        temp
      )
    );
    setBookmarkInitiate(true);
  };

  const formatDate = () => {
    var d = new Date(parseInt(date, 10));
    var ds = d.toString("MM dd");
    return ds.substring(4, 10);
  };

  return (
    <div className={classes.articleCardContainer}>
      <div
        className={classes.containerArticle}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%"
        }}
      >
        <div>
          <div className={classes.articleCardImageContainer}>
            <img
              src={articlePic}
              className={classes.articleCardImage}
              alt="article"
            />
          </div>
          <div className={classes.articleCardTitle}>
            {title?.substring(0, 60)}...
          </div>
          <div className={classes.articleCardSubtitle}>
            {body?.substring(0, 70)}...
          </div>
        </div>
        <div>
          <div className={classes.articleDescriptionContaner}>
            <div className={classes.articleCardDescription}>
              By &nbsp;
              {writer && (
                <div className={classes.articleCardAuthor}>
                  {writer?.length > 12
                    ? `${writer.substring(0, 12)}..`
                    : writer}{" "}
                  &nbsp;
                </div>
              )}
              | {formatDate()}
              &nbsp;&nbsp;
              <div className={classes.svgIcons}>
                <svg
                  width="19"
                  height="12"
                  viewBox="0 0 19 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.26074H6.89"
                    stroke="#2B406E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 11.2607H11.043"
                    stroke="#2B406E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 8.26074H7.902"
                    stroke="#2B406E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 2.26074H6.059"
                    stroke="#3095FF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.3566 5.50298C18.3566 7.98898 16.3406 10.005 13.8546 10.005C11.3676 10.005 9.35156 7.98898 9.35156 5.50298C9.35156 3.01598 11.3676 1.00098 13.8546 1.00098C16.3406 1.00098 18.3566 3.01598 18.3566 5.50298Z"
                    stroke="#3095FF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.7656 3.14551V5.50351L15.0166 6.91451"
                    stroke="#2B406E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              &nbsp;
              {parseInt(readingTime) === 1 || parseInt(readingTime) === 0
                ? `${parseInt(readingTime)} min Read`
                : `${parseInt(readingTime)} mins Read`}
            </div>
            {/* <div className={classes.svgIcons} style={{ cursor: "pointer" }}>
              <svg
                width="12"
                height="17"  
                viewBox="0 0 12 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 3H11" stroke="#3095FF" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11 16.5L5.70588 13.1897L1 16.5V0.5H11V16.5Z"
                  stroke="#2B406E"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  articleCardContainer: {
    borderRadius: "15px",
    backgroundColor: "white",
    boxShadow: "2px 5px 24px rgba(175, 176, 198, 0.297886)",
    // minWidth: '15vw',
    width: "294px",
    // margin: "25px",
    height: "335px",
    // maxWidth: '280px',
    "@media (max-width:780px)": {
      // eslint-disable-line no-useless-computed-key
      minWidth: "260px"
    },
    marginRight: "10px",
    marginBottom: "44px"
  },

  containerArticle: {
    margin: "12px 13px"
    // backgroundColor: 'red'
  },

  articleCardImageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    overflow: "hidden",
    height: "178px",
    width: "268px",
    marginTop: "12px"
  },

  articleCardImage: {
    minWidth: "280px",
    maxWidth: "178px",
    height: "280px",
    width: "170px",
    alignSelf: "center",
    objectFit: "cover"
  },

  articleCardTitle: {
    fontFamily: "Merriweather",
    fontSize: "18px",
    marginTop: "14px",
    fontWeight: "400",
    marginBottom: "11px",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "22px",
    height: "44px"
  },

  articleCardSubtitle: {
    fontSize: "14px",
    color: "#9F9F9F",
    // paddingTop: "3%",
    marginTop: "9px",
    // marginBottom: '11px',
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    width: "276px",
    fontFamily: "Poppins",
    textOverflow: "ellipsis",
    lineHeight: "17px",
    height: "48px"
  },

  articleDescriptionContaner: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "Poppins",
    // height: "100%",
    marginBottom: "26px",
    alignItems: "flex-end"
    // paddingTop: "3%",

    // backgroundColor: 'red',
  },

  articleCardDescription: {
    fontSize: "12px",
    color: "#9F9F9F",
    display: "flex"
    // paddingBottom: '26px',
  },

  articleCardAuthor: {
    color: "#1B73E8"
  },

  svgIcons: {
    display: "flex",
    justifyContent: "cenetr",
    alignItems: "center"
  },

  bookmarkDialog: {
    display: "flex",
    justifyContent: "space-between",
    padding: "3%"
  }
});

export default TopStoriesCard;
