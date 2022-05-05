import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import crypto from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import backgroundSVG from "./../Images/banner-background.svg";
import ImageIcon from "./../Images/imagePNG.png";
import UnsplashIcon from "./../Images/unsplashPNG.png";
import "./Image.svg";
import "./../index.css";
import WriterEditorCoverPhotoUnsplash from "./writerEditorCoverPhotoUnsplash";
import SVG from "./../Images/background.svg";
import { Dialog, TextareaAutosize } from "@mui/material";
import $ from "jquery";
import { uploadArticle } from "../containers/writerEditor/writerEditorActions";
import { showSnackbar } from "../containers/common/commonActions";
import { baseURL, endPoints } from "../utils/apiEndPoints";
import { getAuthToken } from "../containers/common/commonFunctions";

const CoverPhoto = ({
  setArticleTitle,
  setArticleDes,
  setArticleCover,
  articleTitle,
  articleDes,
  articleCover,
  articleId,
  getArticleSuccess,
}) => {
  // console.log(articleTitle);
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  // const [url, setUrl] = useState(data?.url ? data?.url : '');
  // const [caption, setCaption] = useState(data?.caption ? data?.caption : '');
  // const [description, setDescription] = useState(data?.description ? data?.description : '');
  const [progress, setProgress] = useState(0);
  const [unsplashSelected, setUnsplashSelected] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [getArticleInitiate, setGetArticleInitiate] = useState(false);
  const [titleLength, setTitleLength] = useState(0);
  const [subtitleLength, setSubtitleLength] = useState(0);
  const titleRef = useRef(null);
  const [twoClicked, setTwoClicked] = useState(false);
  // const [unsplashURL, setUnsplashURL] = useState('');
  const handleChange = (e) => {
    let img = new Image();
    let bData = [];
    bData.push(e.target.files[0]);
    img.src = window.URL.createObjectURL(
      new Blob(bData, { type: "application/zip" })
    );
    // img.src = window?.URL?.createObjectURL(e.target.files[0]);
    // console.log(e.target.files[0].size / 1024);
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
    // console.log(e.target.files[0]);
  };

  useEffect(() => {
    if (selectedFile) {
      fileUploadHandler();
    }
  }, [selectedFile]);

  const {
    user,
    createNewArticleResp,
    isUploadingImage,
    uploadImageError,
    uploadImageResp,
    isGettingAllArticles,
    getAllArticlesError,
    isGettingArticle,
    getArticleError,
    getArticleResp,
    uploadArticleError,
    isUploadingArticle,
    uploadArticleResp,
  } = useSelector((state) => ({
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
    uploadArticleResp: state.writerEditor.uploadArticleResp,
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
      // console.log(localStorage.getItem('articleId'));
      // dispatch(uploadArticle({
      //     main: {
      //         writeup: '{}',
      //         status: "DRAFT",
      //         title: '',
      //         body: '',
      //         articlePic: '',
      //         readingTime: '',
      //     },
      // }, temp));
      // console.log(twoClicked);
      // setTwoClicked(true);
      dispatch(showSnackbar("Kindly add story title and subtitle.", "warning"));
    } else {
      hiddenInputTwo.current.click();
    }
    // hiddenInputTwo.current.click();
  };

  const fileUploadHandler = (e) => {
    const fd = new FormData();
    fd.append("image", selectedFile, selectedFile.name);
    const aId = localStorage.getItem("articleId");

    const temp = getAuthToken();
    axios
      .put(
        `${baseURL}/${endPoints.uploadImage}?articleId=${aId}`,
        fd,
        {
          headers: {
            Authorization: temp,
          },

          onUploadProgress: (progressEvent) => {
            setProgress(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          },
        }
      )
      .then((resp) => {
        // console.log(resp);
        setArticleCover(resp.data.image);
        setOpenImageDialog(false);
        // onDataChange(resp.data.link, caption);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const calculateHeight = () => {
    let intitalHeight = 0;
    if (titleLength < 45) {
      intitalHeight += 5.5;
    } else if (titleLength > 45 && titleLength < 110) {
      intitalHeight += 11;
    } else {
      intitalHeight += 14;
    }

    if (subtitleLength < 45) {
      intitalHeight += 5.5;
    } else if (subtitleLength > 45 && subtitleLength < 110) {
      intitalHeight += 11;
    } else {
      intitalHeight += 10;
    }
    return `${intitalHeight}rem`;
  };

  const getFontSize = () => {
    let intitalFontSize = 0;
    if (titleLength < 45) {
      intitalFontSize += 35;
    } else if (titleLength > 45 && titleLength < 110) {
      intitalFontSize += 28;
    } else {
      intitalFontSize += 23;
    }
    return `${intitalFontSize}px`;
  };

  useEffect(() => {
    setTitleLength(articleTitle?.length);
  }, [articleTitle]);
  // console.log(articleCover);
  // console.log(articleTitle);
  // console.log(articleDes);
  return (
    <div className={classes.imageUploadSection}>
      {/* {articleCover === '' ? (< div >
                < input type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} ref={hiddenInput} />
                {progress === 0 ? (<div className={classes.input} onClick={handleInputClicked}>Select Cover Photo</div>)
                    : (
                        <div className={classes.progress}>{progress}% Uploaded</div>
                    )}
            </div>) : < div >
                <div onClick={handleInputTwoClicked}>
                    < input type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} ref={hiddenInputTwo} />
                    < img src={articleCover} className={classes.imageStyle} />
                </div>
                <div className={classes.captionContainer}>
                    <img src={backgroundSVG} style={{ position: 'absolute' }} />
                    <input className={classes.captionStyle} value={articleTitle} onChange={(e) => {
                        setArticleTitle(e.target.value);
                        // onDataChange(url, e.target.value);
                    }} placeholder="Title" />
                    <input className={classes.desCaptionStyle} value={articleDes} onChange={(e) => {
                        setArticleDes(e.target.value);
                        // onDataChange(url, e.target.value);
                    }} placeholder="Subtitle" />
                </div>
            </div>} */}
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
                      boxShadow: "none",
                    },
                  }}
                >
                  <div className={classes.input}>
                    {!unsplashSelected && (
                      <button
                        onClick={updateImage}
                        style={{
                          border: "none",
                          outline: "none",
                          backgroundColor: "white",
                        }}
                        disabled={isUploadingArticle}
                      >
                        <img
                          src={ImageIcon}
                          style={{ width: "100px", cursor: "pointer" }}
                          className="imageIcon"
                        />
                      </button>
                    )}
                    {!unsplashSelected && (
                      <div onClick={() => setUnsplashSelected(true)}>
                        <img
                          src={UnsplashIcon}
                          style={{ width: "100px", cursor: "pointer" }}
                          className="imageIcon"
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
                  <div className={classes.progress}>{progress}% Uploaded</div>
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
                          justifyContent: "space-around",
                        }}
                      >
                        {!unsplashSelected && (
                          <button
                            onClick={handleInputClicked}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "#F7F7F7",
                            }}
                            disabled={isUploadingArticle}
                          >
                            <img
                              src={ImageIcon}
                              style={{ width: "100px", cursor: "pointer" }}
                              className="imageIcon"
                            />
                          </button>
                        )}
                        {!unsplashSelected && (
                          <div onClick={() => setUnsplashSelected(true)}>
                            <img
                              src={UnsplashIcon}
                              style={{ width: "100px", cursor: "pointer" }}
                              className="imageIcon"
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
            style={{ height: calculateHeight() }}
            style={{ backgroundImage: `url(${backgroundSVG})` }}
          >
            {/* <img src={backgroundSVG} style={{ position: 'absolute', width: '100%', height:'100%'}} /> */}
            {/* <div className={classes.caption}> */}
            <div
              className={classes.captionAndDescription}
              style={{ padding: "1rem" }}
            >
              {/* <div contentEditable={true} id="test" maxLength="58" className={classes.captionStyle} value={articleTitle} onChange={(e) => {
                            let text = e.target.value;
                            if (2) text = text.split('\n').slice(0, 2 ?? undefined)
                            setArticleTitle(text);
                        }} id="test" /> */}
              <TextareaAutosize
                maxLength="200"
                ref={titleRef}
                style={{ fontSize: getFontSize() }}
                className={classes.captionStyle}
                value={articleTitle}
                onChange={(e) => {
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
                onChange={(e) => {
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
              {/* <div contentEditable={true} id="testD" maxLength="95" className={classes.desCaptionStyle} value={articleDes} onChange={(e) => {
                            let text = e.target.value;
                            if (2) text = text.split('\n').slice(0, 2 ?? undefined)
                            setArticleDes(text);
                        }} placeholder="Enter a subtitle" /> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

const useStyles = makeStyles({
  imageUploadSection: {
    marginBottom: "3%",
  },

  input: {
    width: "100%",
    outline: "none",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "2% 0% 2% 0%",
  },

  progress: {
    idth: "100%",
    backgroundColor: "#F7F7F7",
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 0% 2% 0%",
  },

  inputNi: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    outline: "none",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "2% 0% 2% 0%",
    height: "calc(100% - 10rem)",
  },

  progressNi: {
    idth: "100%",
    backgroundColor: "#F7F7F7",
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 0% 2% 0%",
    height: "calc(100% - 10rem)",
  },

  imageStyle: {
    width: "100%",
    height: "80vh",
    maxHeight: "35rem",
    objectFit: "cover",
  },

  captionContainer: {
    marginTop: "-11rem",
    filter: "blur(0px)",
    overflow: "hidden",
    background: "#191F28",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  captionAndDescription: {
    // backgroundColor: 'red',
    zIndex: 1,
    width: "50%",
    display: "flex",
    flexDirection: "column",
    // paddingTop: '2%',
  },

  caption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    textAlign: "start",
    justifyContent: "flex-end",
    clear: "both",
  },

  captionStyle: {
    maxWidth: "100%",
    minWidth: "50%",
    textWrap: "wrap",
    // textAlign: 'justify',
    outline: "none",
    border: "none",
    color: "white",
    background: "transparent",
    zIndex: 1,
    fontSize: "35px",
    fontFamily: "Merriweather",
    resize: "none",
    // textAlignLast: 'center',
    // textAlign: 'center',
    // textAlignLast: 'left',
  },

  desCaptionStyle: {
    maxWidth: "100%",
    minWidth: "50%",
    // textAlign: 'center',
    outline: "none",
    border: "none",
    color: "white",
    fontFamily: "Poppins",
    background: "transparent",
    fontSize: "20px",
    zIndex: 1,
    resize: "none",
  },

  coverIcon: {
    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 200'%3E%3Cpath d='M10 10h123v123H10z'/%3E%3C/svg%3E')`,
    // background-image: url( "" );
  },
});

export default CoverPhoto;
