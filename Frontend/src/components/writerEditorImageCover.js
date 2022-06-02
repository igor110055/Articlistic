import { makeStyles } from "@mui/styles";
import { useState } from "react";
import WriterEditorCoverPhotoUnsplash from "./writerEditorCoverPhotoUnsplash";

const WriterEditorImageCover = ({
  setArticleTitle,
  setArticleDes,
  articleTitle,
  articleDes
}) => {
  const classes = useStyles();
  const [addPhotoClicked, setAddPhotoClicked] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(false);
  const [unsplashURL, setUnsplashURL] = useState("");
  return (
    <div className={classes.coverContainer}>
      {!addPhotoClicked && !selectedPhoto ? (
        <div
          className={classes.addPhotoTab}
          onClick={() => setAddPhotoClicked(true)}
        >
          Add cover photo from unSplash
        </div>
      ) : (
        !selectedPhoto && (
          <WriterEditorCoverPhotoUnsplash
            setUnsplashURL={setUnsplashURL}
            setAddPhotoClicked={setAddPhotoClicked}
            setSelectedPhoto={setSelectedPhoto}
          />
        )
      )}
      {selectedPhoto && (
        <div>
          <img
            src={unsplashURL}
            className={classes.imageCover}
            onClick={() => {
              setAddPhotoClicked(false);
              setSelectedPhoto(false);
            }}
            alt="unsplash"
          />
          <div className={classes.coverFooter}>
            <div className={classes.coverFooterContent}>
              <input
                placeHolder="Enter Title"
                className={classes.coverFooterTitle}
                value={articleTitle}
                onChange={e => setArticleTitle(e.target.value)}
              />
              <input
                placeholder="Enter description"
                className={classes.coverFooterText}
                value={articleDes}
                onChange={e => setArticleDes(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  coverContainer: {
    // paddingTop: '4rem',
  },

  addPhotoTab: {
    width: "100%",
    textAlign: "center",
    padding: "2% 0% 2% 0%",
    color: "#6B6B6B",
    backgroundColor: "#F7F7F7",
    cursor: "pointer"
  },

  imageCover: {
    width: "100%",
    height: "80vh",
    objectFit: "cover",
    cursor: "pointer"
  },

  coverFooter: {
    backgroundColor: "black",
    color: "white",
    bottom: "0rem",
    width: "100%",
    height: "10rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-1rem"
  },

  coverFooterContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },

  coverFooterTitle: {
    fontWeight: "bolder",
    fontFamily: "Merriweather",
    fontSize: "24px",
    border: "none",
    outline: "none",
    background: "transparent",
    textAlign: "center",
    color: "white"
  },

  coverFooterText: {
    fontFamily: "Poppins",
    fontSize: "18px",
    border: "none",
    outline: "none",
    background: "transparent",
    textAlign: "center",
    color: "white"
  }
});

export default WriterEditorImageCover;
