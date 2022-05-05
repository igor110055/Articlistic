import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookmarkArticle } from "../../containers/home/homeActions";

import { Button, Dialog, DialogTitle, CircularProgress } from "@mui/material";
import { getAuthToken } from "../../containers/common/commonFunctions";

const ArticleCard = ({ dummyImage }) => {
  const [bookmarkInitiate, setBookmarkInitiate] = useState(false);
  const [bookmarkDone, setBookmarkDone] = useState(false);
  const [openBookmarkDialog, setOpenBookmarkDialog] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isBookmarkingArticle, bookmarkArticleError } = useSelector(state => ({
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
  const handleBookmark = () => {
    const temp = getAuthToken();
    dispatch(
      bookmarkArticle(
        {
          articleId: "f1b9db36-0756-47e9-b95a-89f2d18ec5c4"
        },
        temp
      )
    );
    setBookmarkInitiate(true);
  };
  return (
    <div className={classes.articleCardContainer}>
      <div
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
              src={dummyImage}
              className={classes.articleCardImage}
              alt="dummy"
            />
          </div>
          <div className={classes.articleCardTitle}>
            Android’s AirDrop-style file sharing feature may be Android’s
            AirDrop-style file sharing feature may be
          </div>
          <div className={classes.articleCardSubtitle}>
            It appears the feature will work on the Chromebooks and PCs running
            as…
          </div>
        </div>
        <div>
          <div className={classes.articleDescriptionContaner}>
            <div className={classes.articleCardDescription}>
              By &nbsp;
              <div className={classes.articleCardAuthor}>
                Kim Lyons &nbsp;
              </div>{" "}
              | June 21 &nbsp;&nbsp;
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
              &nbsp;6 min Read
            </div>
            {dummyImage === "/static/media/image (3).2902fcf1.png" && (
              <Dialog
                open={openBookmarkDialog}
                onClose={() => setOpenBookmarkDialog(false)}
              >
                <DialogTitle>
                  Do you really want to unbookmark this story?
                </DialogTitle>
                <div className={classes.bookmarkDialog}>
                  <Button
                    sx={{
                      // "&.MuiButton-text": { color: "white" },
                      height: "4em",
                      width: "25%",
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: "0.9em",
                      textTransform: "capitalize",
                      background:
                        "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
                      "&.MuiButton-text": { color: "#6B6B6B" },
                      // border: "2px black solid",
                      // background: "#FFFFFF",
                      // fontFamily: "Poppins",
                      color: "white",
                      padding: "2%",
                      border: "2px solid #6B6B6B",
                      // fontWeight: "700",
                      "&:hover": {
                        backgroundColor: "white"
                      },
                      borderRadius: "10px"
                    }}
                    // disabled={isGettingRefreshToken || isLoggingOut}
                    onClick={() => setOpenBookmarkDialog(false)}
                  >
                    {false ? (
                      <CircularProgress style={{ color: "white" }} />
                    ) : (
                      `No`
                    )}
                  </Button>
                  <Button
                    sx={{
                      "&.MuiButton-text": { color: "white" },
                      height: "4em",
                      width: "25%",
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: "0.9em",
                      textTransform: "capitalize",
                      background:
                        "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
                      borderRadius: "10px"
                    }}
                    // disabled={isGettingRefreshToken || isLoggingOut}
                    onClick={handleBookmark}
                  >
                    {false ? (
                      <CircularProgress style={{ color: "white" }} />
                    ) : (
                      `Yes`
                    )}
                  </Button>
                </div>
              </Dialog>
            )}
            <div
              className={classes.svgIcons}
              style={{ cursor: "pointer" }}
              onClick={() => setOpenBookmarkDialog(true)}
            >
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
            </div>
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
    padding: "1%",
    // minWidth: '15vw',
    width: "20vw",
    height: "24vw",
    // maxWidth: '280px',
    "@media (max-width:780px)": {
      // eslint-disable-line no-useless-computed-key
      minWidth: "260px"
    },
    marginRight: "10px"
  },

  articleCardImageContainer: {
    borderRadius: "10px",
    overflow: "hidden",
    minHeight: "12vw",
    maxHeight: "12vw"
    // minHeight: '100%',
    // maxHeight: '100%',
  },

  articleCardImage: {
    minWidth: "20vw",
    maxWidth: "20vw",
    // minHeight: '170px',
    // maxHeight: '170px',
    objectFit: "cover"
  },

  articleCardTitle: {
    fontFamily: "Merriweather",
    fontSize: "16px",
    paddingTop: "3%",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "24px",
    height: "54px"
  },

  articleCardSubtitle: {
    fontSize: "14px",
    color: "rgba(159, 159, 159, 1)",
    paddingTop: "3%",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "22px",
    height: "50px"
  },

  articleDescriptionContaner: {
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
    alignItems: "flex-end",
    paddingTop: "3%"
    // paddingBottom: '3%',
    // backgroundColor: 'red',
  },

  articleCardDescription: {
    fontSize: "12px",
    color: "#9F9F9F",
    display: "flex"
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

export default ArticleCard;
