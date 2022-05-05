import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import backgroundSVG from "./../Images/banner-background.svg";
import ImageIcon from "./../Images/imagePNG.png";
import UnsplashIcon from "./../Images/unsplashPNG.png";
import "./Image.svg";
import userImage from "./../Images/user-image.png";
import "./../index.css";
import WriterEditorCoverPhotoUnsplash from "./writerEditorCoverPhotoUnsplash";
import { Button, Dialog, TextareaAutosize } from "@mui/material";

import { showSnackbar } from "../containers/common/commonActions";
import { baseURL, endPoints } from "../utils/apiEndPoints";
import { getAuthToken } from "../containers/common/commonFunctions";
import { Box } from "@mui/system";

const CoverPhoto = ({
  setArticleTitle,
  setArticleDes,
  setArticleCover,
  articleTitle,
  articleDes,
  articleCover,
  articleWriter,
  articleId,
  getArticleSuccess,
  readingTimeLive
}) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);

  const [progress, setProgress] = useState(0);
  const [unsplashSelected, setUnsplashSelected] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [titleLength, setTitleLength] = useState(articleTitle.length || 0);
  const [subtitleLength, setSubtitleLength] = useState(articleDes.length || 0);
  const titleRef = useRef(null);
  const [twoClicked, setTwoClicked] = useState(false);
  // const [unsplashURL, setUnsplashURL] = useState('');
  const handleChange = e => {
    let img = new Image();
    let bData = [];
    bData.push(e.target.files[0]);
    img.src = window.URL.createObjectURL(
      new Blob(bData, { type: "application/zip" })
    );

    img.onload = () => {
      if (
        img.width / img.height >= 4 / 3 &&
        e.target.files[0].size / (1024 * 1024) <= 5
      ) {
        setSelectedFile(e.target.files[0]);
        setArticleCover("");
      } else {
        alert(
          `Cover photo should follow 4:3 aspect ratio and should be less than 5 mb`
        );
      }
    };
  };

  useEffect(() => {
    if (selectedFile) {
      fileUploadHandler();
    }
  }, [selectedFile]);

  const { getArticleResp, isUploadingArticle } = useSelector(state => ({
    user: state.user,
    createNewArticleResp: state.writerEditor.createNewArticleResp,
    isuploadingImage: state.writerEditor.isUploadingImage,
    uploadImageError: state.writerEditor.uploadImageError,
    uploadImageResp: state.writerEditor.uploadImageResp,
    isGettingAllArticles: state.writerEditor.isGettingAllArticles,
    getAllArticlesError: state.writerEditor.getAllArticlesError,
    isGettingArticle: state.writerEditor.isGettingArticle,
    getArticleError: state.writerEditor.getArticleError,
    getArticleResp: state.writerEditor.getArticleResp,
    uploadArticleError: state.writerEditor.uploadArticleError,
    isUploadingArticle: state.writerEditor.isUploadingArticle,
    uploadArticleResp: state.writerEditor.uploadArticleResp
  }));

  const [inputClicked, setInputClicked] = useState(false);

  // useEffect(() => {
  //     if (uploadArticleError) {
  //         setTwoClicked(false);
  //     } else {
  //         if (!isUploadingArticle && twoClicked) {
  //             localStorage.setItem('articleId', uploadArticleResp.articleId);
  //             console.log('ashf');
  //             if (hiddenInput.current) {
  //                 hiddenInput.current?.click();
  //             } else {
  //                 hiddenInputTwo.current?.click();
  //             }
  //             setTwoClicked(false);
  //         }
  //     }
  //     console.log(twoClicked);
  // }, [isUploadingArticle]);

  const hiddenInput = useRef(null);
  const hiddenInputTwo = useRef(null);
  const dispatch = useDispatch();

  const handleInputClicked = () => {
    setTwoClicked(true);
    // console.log(document.querySelectorAll('.imageIcon'));
    const imageIconList = document.querySelectorAll(".imageIcon");

    const temp = getAuthToken();
    if (localStorage.getItem("articleId") === null) {
      dispatch(showSnackbar("Kindly add story title and subtitle.", "warning"));
      setInputClicked(true);
    } else {
      hiddenInput.current.click();
    }
    // console.log('akfj');
  };
  const handleInputTwoClicked = () => {
    setOpenImageDialog(true);
    // hiddenInputTwo.current.click();
    // console.log('akfj');
  };

  const updateImage = () => {
    // console.log('kahg');
    // console.log(document.querySelectorAll('.imageIcon'));

    const temp = getAuthToken();
    if (localStorage.getItem("articleId") === null) {
      dispatch(showSnackbar("Kindly add story title and subtitle.", "warning"));
    } else {
      hiddenInputTwo.current.click();
    }
  };

  const fileUploadHandler = e => {
    const fd = new FormData();
    fd.append("image", selectedFile, selectedFile.name);
    const aId = localStorage.getItem("articleId");

    const temp = getAuthToken();
    axios
      .put(`${baseURL}/${endPoints.uploadImage}?articleId=${aId}`, fd, {
        headers: {
          Authorization: temp
        },

        onUploadProgress: progressEvent => {
          setProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        }
      })
      .then(resp => {
        // console.log(resp);
        setArticleCover(resp.data.image);
        setOpenImageDialog(false);
      })
      .catch(error => {});
  };

  const calculateHeight = () => {
    let intitalHeight = 0;
    if (titleLength <= 45) {
      intitalHeight += 5;
    } else if (titleLength > 45 && titleLength <= 110) {
      intitalHeight += 7;
    } else {
      intitalHeight += 8;
    }

    if (subtitleLength <= 45) {
      intitalHeight += 4;
    } else if (subtitleLength >= 45 && subtitleLength <= 110) {
      intitalHeight += 7.5;
    } else {
      intitalHeight += 11;
    }
    return `${intitalHeight}rem`;
  };

  const getFontSize = () => {
    let intitalFontSize = 0;
    if (titleLength <= 45) {
      intitalFontSize += 35;
    } else if (titleLength > 45 && titleLength < 110) {
      intitalFontSize += 26;
    } else {
      intitalFontSize += 23;
    }
    return `${intitalFontSize}px`;
  };

  useEffect(() => {
    setTitleLength(articleTitle?.length);
  }, [articleTitle]);

  const readingTime = parseInt(
    readingTimeLive ||
      JSON.parse(localStorage.getItem("article"))?.article?.public.readingTime
  );
  const date = JSON.parse(localStorage.getItem("article"))?.article
    ?.lastUpdated;

  const formatDate = date => {
    let realDate = date || Date.now();
    var d = new Date(parseInt(realDate, 10));
    var ds = d.toString("MM dd");
    return ds.substring(4, 10);
  };

  return (
    <div className={classes.imageUploadSection}>
      {
        <div>
          <div>
            {articleCover !== "" ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                  ref={hiddenInputTwo}
                />
                <img
                  src={articleCover}
                  className={classes.imageStyle}
                  onClick={handleInputTwoClicked}
                  style={{ cursor: "pointer" }}
                  alt="profile"
                />
                <Dialog
                  open={openImageDialog}
                  onClose={() => {
                    setOpenImageDialog(false);
                    setUnsplashSelected(false);
                  }}
                  PaperProps={{
                    style: {
                      maxWidth: "30vw",
                      minWidth: "30vw",
                      padding: "1%",
                      boxShadow: "none"
                    }
                  }}
                >
                  <div className={classes.input}>
                    {!unsplashSelected && (
                      <button
                        onClick={updateImage}
                        style={{
                          border: "none",
                          outline: "none",
                          backgroundColor: "white"
                        }}
                        disabled={isUploadingArticle}
                      >
                        <img
                          src={ImageIcon}
                          style={{ width: "100px", cursor: "pointer" }}
                          className="imageIcon"
                          alt="profile"
                        />
                      </button>
                    )}
                    {!unsplashSelected && (
                      <div onClick={() => setUnsplashSelected(true)}>
                        <img
                          src={UnsplashIcon}
                          style={{ width: "100px", cursor: "pointer" }}
                          className="imageIcon"
                          alt="profile"
                        />
                      </div>
                    )}
                    {unsplashSelected && (
                      <WriterEditorCoverPhotoUnsplash
                        setUnsplashURL={setArticleCover}
                        setOpenImageDialog={setOpenImageDialog}
                        setUnsplashSelected={setUnsplashSelected}
                      />
                    )}
                  </div>
                </Dialog>
                {progress === 0 ? (
                  <div className={classes.input}>
                    <div></div>
                  </div>
                ) : (
                  <div className={classes.progress}></div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                  ref={hiddenInput}
                />
                <div className={classes.imageStyle}>
                  {progress === 0 ? (
                    <div className={classes.inputNi}>
                      <div
                        style={{
                          display: "flex",
                          width: "50%",
                          justifyContent: "space-around"
                        }}
                      >
                        {!unsplashSelected && (
                          <button
                            onClick={handleInputClicked}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "#F7F7F7"
                            }}
                            disabled={isUploadingArticle}
                          >
                            <img
                              src={ImageIcon}
                              style={{ width: "100px", cursor: "pointer" }}
                              className="imageIcon"
                              alt="profile"
                            />
                          </button>
                        )}
                        {!unsplashSelected && (
                          <div onClick={() => setUnsplashSelected(true)}>
                            <img
                              src={UnsplashIcon}
                              style={{ width: "100px", cursor: "pointer" }}
                              className="imageIcon"
                              alt="profile"
                            />
                          </div>
                        )}
                        {unsplashSelected && (
                          <WriterEditorCoverPhotoUnsplash
                            setUnsplashURL={setArticleCover}
                            setOpenImageDialog={setOpenImageDialog}
                            setUnsplashSelected={setUnsplashSelected}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={classes.progressNi}>
                      {progress}% Uploaded
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            className={classes.captionContainer}
            style={{ backgroundImage: `url(${backgroundSVG})` }}
          >
            <div
              className={classes.captionAndDescription}
              style={{ padding: "1rem" }}
            >
              <TextareaAutosize
                maxLength="200"
                ref={titleRef}
                style={{ fontSize: getFontSize() }}
                className={classes.captionStyle}
                value={articleTitle}
                onChange={e => {
                  let text = e.target.value;
                  setTitleLength(text.length);
                  if (e.nativeEvent.inputType === "insertLineBreak") {
                    e.preventDefault();
                  } else {
                    if (2) text = text.split("\n").slice(0, 2 ?? undefined);
                    setArticleTitle(text[0]);
                  }
                }}
                placeholder="Enter Title"
              />
              <TextareaAutosize
                maxLength="200"
                className={classes.desCaptionStyle}
                value={articleDes}
                onChange={e => {
                  let text = e.target.value;
                  setSubtitleLength(text.length);
                  if (e.nativeEvent.inputType === "insertLineBreak") {
                    e.preventDefault();
                  } else {
                    if (2) text = text.split("\n").slice(0, 2 ?? undefined);
                    setArticleDes(text[0]);
                  }
                }}
                placeholder="Enter Subtitle"
              />
            </div>
          </div>
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
                      color: "black"
                    }}
                  >
                    {localStorage.getItem("writerName") || "Dummy Writer"}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#636363",
                      fontWeight: "600"
                    }}
                  >
                    {formatDate(date)} ·{" "}
                    {getArticleResp && !readingTime ? "0" : readingTime}{" "}
                    {readingTime > 1 ? "mins read" : "min read"}
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
                      borderRadius: "10px"
                    }}
                    style={{ marginRight: "4%", width: "8rem", height: "3rem" }}
                  >
                    Follow
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      }
    </div>
  );
};

const useStyles = makeStyles({
  imageUploadSection: {
    marginBottom: "0%"
  },

  input: {
    width: "100%",
    outline: "none",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "2% 0% 2% 0%"
  },

  progress: {
    idth: "100%",
    backgroundColor: "white",
    outline: "none",
    zIndex: -4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 0% 2% 0%"
    // height: '14rem'
  },

  inputNi: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    outline: "none",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "2% 0% 2% 0%",
    height: "calc(100% - 10rem)"
  },

  progressNi: {
    idth: "100%",
    backgroundColor: "#F7F7F7",
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 0% 2% 0%",
    height: "calc(100% - 10rem)"
  },

  imageStyle: {
    width: "100%",
    height: "80vh",
    maxHeight: "35rem",
    objectFit: "cover"
  },

  captionContainer: {
    marginTop: "-11rem",
    filter: "blur(0px)",
    padding: "0.5rem",
    overflow: "hidden",
    background: "#191F28",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },

  captionAndDescription: {
    // backgroundColor: 'red',
    zIndex: 1,
    width: "758px",
    display: "flex",
    flexDirection: "column"
    // paddingTop: '2%',
  },

  caption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    textAlign: "start",
    justifyContent: "flex-end",
    clear: "both"
  },

  captionStyle: {
    // maxWidth: "100%",
    // minWidth: "50%",
    textWrap: "wrap",
    // textAlign: 'justify',
    outline: "none",
    border: "none",
    color: "white",
    background: "transparent",
    zIndex: 1,
    fontSize: "35px",
    fontFamily: "Merriweather",
    resize: "none"
    // textAlignLast: 'center',
    // textAlign: 'center',
    // textAlignLast: 'left',
  },

  desCaptionStyle: {
    // textAlign: 'center',
    outline: "none",
    border: "none",
    color: "white",
    fontFamily: "Poppins",
    background: "transparent",
    fontSize: "20px",
    zIndex: 1,
    resize: "none"
  },

  coverIcon: {
    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 200'%3E%3Cpath d='M10 10h123v123H10z'/%3E%3C/svg%3E')`
    // background-image: url( "" );
  },

  writerInfoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1.4rem",
    mixBlendMode: "normal"
  },

  writerInfoName: {
    border: "1px solid #979797",
    height: "93px",
    width: "758px",
    borderRadius: "20px",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
  },

  iconNameContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: "20px"
  },

  rightDummyInfo: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: "20px"
  },

  dummySvgContainer: {
    marginRight: "20px",
    borderRadius: "50%",
    border: "1px solid #CECECE",
    width: "39px",
    height: "39px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  dummyRightContainer: {
    marginRight: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  writerDisplayIcon: {
    width: "40px",
    marginTop: "8px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover"
  }
});

export default CoverPhoto;
