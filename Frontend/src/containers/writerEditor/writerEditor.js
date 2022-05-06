import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "./header";
import Paragraph from "./paragraph";
import List from "./list";
import Embed from "@editorjs/embed";
import SimpleImage from "@editorjs/simple-image"
import Twitter from "./twitterBlock";
import DragDrop from "editorjs-drag-drop";
import { useLocation } from "react-router-dom";
import Undo from "editorjs-undo";
// import Marker from "@editorjs/marker";
import TempBlock from "./tempBlock";
import SpotifyBlock from "./spotifyBlock/spotifyBlock";
import DelimiterBlock from "./delimiterBlock/delimliterBlock";
import QuoteBlock from "./quoteBlock/quoteBlock";
import NftBlock from "./nftBlock/nftBlock";
import ImageUploadBlock from "./imageUploadBlock/imageUploadBlock";
import { Container, Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { uploadArticle, getArticle } from "./writerEditorActions";
import Cookie from "js-cookie";
import { useNavigate } from "react-router";
import iconOnly from "./../../Images/icon_only.svg";
import CoverPhoto from "../../components/coverPhoto";
import readingTime from "reading-time";
import { CircularProgress } from "@mui/material";
import { userUsername } from "../user/userActions";
import { useInterval } from "./../../utils/common";
import Auth from "../../components/auth";
// import placeholderImage from '../../Images/icon_only.png'
import CodeBlock from "./codeBlock/codeBlock";
import VideoBlock from "./videoBlock/videoBlock";
import MainLoader from "../../components/mainLoader";
import "./../../index.css";
import { getAuthToken } from "../common/commonFunctions";
import { TwitterScriptHandler } from "../../utils/twitterHandler";

const DEFAULT_INITIAL_DATA = () => {
  return {
    time: new Date().getTime(),
    blocks: [
      {
        id: "1",
        type: "header",
        data: {
          text: "",
          level: 1
        }
      }
    ]
  };
};

const WriterEditor = () => {
  const classes = useStyles();
  const {state} = useLocation()
  const navigate = useNavigate();
  const [editorData, setEditorData] = useState();
  const [check, setCheck] = useState(false);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleDes, setArticleDes] = useState("");
  const [articleCover, setArticleCover] = useState("");
  const [getArticleSuccess, setGetArticleSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [saveDraftInitiate, setSaveDraftInitiate] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [getArticleInitiate, setGetArticleInitiate] = useState(false);
  const [articleData, setArticleData] = useState({});
  const [startTimer, setStartTimer] = useState(false);
  const [savedBefore, setSavedBefore] = useState(0);
  let [counter, setCounter] = useState(0);
  const [saveClicked, setSaveClicked] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [noImageFound, setNoImageFound] = useState(false);
  const [noTitleFound, setNoTitleFound] = useState(false);
  const [noSubtitleFound, setNoSubtitleFound] = useState(false);
  const [notFoundErrorMsg, setNotFoundErrorMsg] = useState("");
  const [alreadySignedIn, setAlreadySignedIn] = useState(false);
  const [readingTimeLive, setReadingTimeLive] = useState('')
  const editorInstance = useRef();
  const [firstTimeSaved, setFirstTimeSaved] = useState(false);
  const [isSavingFirstTime, setIsSavingFirstTime] = useState(false);
  const [firstTimeImport, setFirstTimeImport] = useState(true)

  useEffect(() => {
    window.addEventListener("mousedown", () => {
      // console.log('mouseDown')
    });
    window.addEventListener("mouseup", () => {
      // console.log('mouseUp')
    });
    window.addEventListener("ondrag", () => {
      // console.log('mouseend')
    });
  }, []);

  const startEditor = () => {

    const twitter = TwitterScriptHandler()
    twitter.initialize().then(() => {
      const editor = new EditorJS({
        inlineToolbar: true,
        onChange: () => {
          getReadingTime()            
        },
        onReady: () => {
          editorInstance.current = editor;
          getReadingTime()
          if(state){
            const {html, articleId, heading, subtitle} = state
            setArticleTitle(heading)
            setArticleDes(subtitle)
            editorInstance?.current?.blocks?.renderFromHTML(html)
            saveImport()
            getReadingTime()
          }
          setCheck(true);
          try {
            new Undo({ editor });
          } catch {
            // console.log('wait a while');
          }
          try {
            new DragDrop(editor);
          } catch {
            // console.log('wait a while');
          }
          // setInterval(() => {
          //     saveDraft();
          // }, 120000);
        },
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder:
                "Write the first draft of this story, you can refine it later.",
              levels: [1, 2, 3],
              defaultLevel: 1,
              // lineHeight: 15,
              // fontFamily: 'Merriweather',
            },
          },
          list: {
            class: List,
            shortcut: "CMD+SHIFT+l",
            inlineToolbar: true,
          },
          quote: QuoteBlock,
          delimiter: DelimiterBlock,
          // image: ImageUploadBlock,
          image: {
            class: ImageUploadBlock,
            inlineToolbar: true,
          },
          unsplash: TempBlock,
          imageCopy: {
            class: SimpleImage,
            inlineToolbar: ["link"]
          },
          video: VideoBlock,
          spotify: SpotifyBlock,
          twitter: {
            class: Twitter,
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
                spotify: {
                  regex: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/,
                  embedUrl:
                    "https://embed.spotify.com/?uri=https://open.spotify.com/track/6teW0qt23aGnWhC0rSvtoz?si=a02a9857240a4e44",
                  html:
                    "<iframe src='https://embed.spotify.com/?uri=https://open.spotify.com/track/6teW0qt23aGnWhC0rSvtoz?si=39d59b3cb3134df5' width='100%' height='380' frameBorder='0' allowfullscreen=' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'></iframe>",
                  height: 300,
                  width: 600,
                  // id: (groups) => groups.join('/embed/')
                },
              },
            },
          },
          nft: NftBlock,
          code: CodeBlock,
          // Marker: {
          //   class: Marker,
          //   shortcut: "CMD+SHIFT+M",
          // },
        },
  
        data: editorData || DEFAULT_INITIAL_DATA,
        autofocus: true,
        // placeholder: 'Write your story!',
      });
    })
  };

  const getReadingTime = () => {
    editorInstance.current
    ?.save()
    .then((outputData) => {
      let readTime = 0;
      for (let i = 0; i < outputData.blocks.length; i++) {
        // console.log(outputData.blocks[i].data);
        if (outputData.blocks[i].data?.text !== undefined) {
          readTime += readingTime(outputData.blocks[i]?.data?.text).time;
        }
        if (
          outputData.blocks[i].type === "image" ||
          outputData.blocks[i].type === "unsplash"
        ) {
          readTime += 8000;
        }
        setReadingTimeLive( Math.ceil(readTime / 60000) === 1
      ? `${Math.ceil(readTime / 60000)} min`
      : `${readTime / 60000} mins`)
      }})
  }

  useEffect(() => {
    if (!editorInstance.current && editorData) {
      startEditor();
    }
    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
    setNextClicked(false);
  }, [editorData]);

  const dispatch = useDispatch();
  const {
    userUserName,
    isUploadingArticle,
    uploadArticleError,
    uploadArticleErrorMsg,
    uploadArticleResp,
    isGettingArticle,
    getArticleError,
    getArticleResp
  } = useSelector(state => ({
    userUserName: state.user.userUserName,
    isUploadingArticle: state.writerEditor.isUploadingArticle,
    uploadArticleError: state.writerEditor.uploadArticleError,
    uploadArticleErrorsg: state.writerEditor.uploadArticleError,
    uploadArticleResp: state.writerEditor.uploadArticleResp,
    isGettingArticle: state.writerEditor.isGettingArticle,
    getArticleError: state.writerEditor.getArticleError,
    getArticleResp: state.writerEditor.getArticleResp
  }));

  useEffect(() => {
    if (getArticleSuccess) {
      if (getArticleResp.article.writeup) {
        setEditorData(JSON.parse(getArticleResp.article?.writeup));
      }
    }
    if (getArticle) {
    }
  }, [getArticleSuccess]);

  useInterval(() => {
    if (!isSavingFirstTime) saveDraft();
  }, 120000);

  useEffect(() => {
    if (getArticleError) {
      setArticleData({});
      setGetArticleInitiate(false);
      setGetArticleSuccess(false);
    } else {
      if (!isGettingArticle && getArticleInitiate) {
        // console.log(getArticleResp);
        localStorage.setItem("article", JSON.stringify(getArticleResp));
        // console.log(getArticleResp);
        setArticleData(
          getArticleResp?.article?.writeup
            ? JSON.parse(getArticleResp.article.writeup)
            : ""
        );
        setArticleTitle(
          getArticleResp.article?.public?.title
            ? getArticleResp.article.public.title
            : ""
        );
        setArticleDes(
          getArticleResp.article?.public?.body
            ? getArticleResp.article.public.body
            : ""
        );
        setArticleCover(
          getArticleResp.article?.public?.articlePic
            ? getArticleResp.article.public.articlePic
            : ""
        );
        setGetArticleSuccess(true);
        if (getArticleResp?.article?.writeup) {
          if (
            JSON.parse(getArticleResp.article.writeup)?.blocks?.length < 1 ||
            JSON.parse(getArticleResp.article.writeup).blocks === undefined
          ) {
            editorInstance?.current?.render({
              blocks: [
                {
                  id: "1",
                  type: "header",
                  data: {
                    text: "",
                    level: 1
                  }
                }
              ]
            });
          } else {
            editorInstance?.current?.render({
              blocks: JSON.parse(getArticleResp.article?.writeup).blocks
            });
          }
        }
      }
    }
  }, [isGettingArticle]);

  useEffect(() => {
    if (userUserName !== "") {
      setInterval(() => {
        setCounter(counter => (counter === 120 ? 0 : counter + 1));
      }, 1000);
    }
  }, [startTimer]);

  useEffect(() => {
    if (Cookie.get("oneDayBeforeAccessToken")) {
      setAlreadySignedIn(true);
    } else {
      setAlreadySignedIn(false);
    }
    dispatch(
      userUsername(JSON.parse(localStorage.getItem("user")).userUserName)
    );
  }, []);

  useEffect(() => {
    if (userUserName !== "" && localStorage.getItem("articleId")) {
      setStartTimer(true);
      const aId = localStorage.getItem("articleId");
      const temp = getAuthToken();
      dispatch(getArticle({ articleId: aId, username: userUserName }, temp));
      setGetArticleInitiate(true);
    } else {
      setEditorData(DEFAULT_INITIAL_DATA);
    }
  }, [userUserName]);
  // console.log(uploadArticleResp);

  useEffect(() => {
    if (uploadArticleError) {
      setUploadSuccess(false);
    } else {
      if (!isUploadingArticle && saveDraftInitiate) {
        setUploadSuccess(true);
        counter = 0;
        setCounter(counter);
        if (uploadArticleResp?.articleId) {
          localStorage.setItem("articleId", uploadArticleResp.articleId);
        }
        if (nextClicked) {
          navigate("/writerSettings");
        }
      }
    }
  }, [isUploadingArticle]);


  const saveImport = () => {
    if(state && firstTimeImport) {
      const temp = getAuthToken();
      const {heading, subtitle, articleId, originUrl} = state
      editorInstance.current
      ?.save()
      .then((outputData) => {
        let readTime = 0;
        for (let i = 0; i < outputData.blocks.length; i++) {
          // console.log(outputData.blocks[i].data);
          if (outputData.blocks[i].data?.text !== undefined) {
            readTime += readingTime(outputData.blocks[i]?.data?.text).time;
          }
          if (
            outputData.blocks[i].type === "image" ||
            outputData.blocks[i].type === "unsplash"
          ) {
            readTime += 8000;
          }
        }
      dispatch(
        uploadArticle(
          {
            main: {
              writeup: JSON.stringify(outputData),
              status: "DRAFT",
              newlyImported: true,
              originUrl: originUrl,
              origin: 'substack',
              articlePic: articleCover,
              title: heading || 'Imported Draft',
              body: subtitle || '',
              readingTime:
                Math.ceil(readTime / 60000) === 1
                  ? `${Math.ceil(readTime / 60000)} min`
                  : `${readTime / 60000} mins`,
            },

            qParams: {
              writer: userUserName,
              articleId: articleId,
            },
          },
          temp
        )
      );
      setFirstTimeImport(false)
      localStorage.setItem('articleId', articleId)
    })}
  }

  const saveDraft = () => {
    if (getArticleResp?.article?.status === "PUBLISHED") {
      return;
    }
    if (articleTitle !== "" && articleDes !== "" && (!firstTimeImport || !state) ) {
      counter = 0;

      const temp = getAuthToken();
      // console.log(decAccessToken, articleCover);
      editorInstance.current
        ?.save()
        .then(outputData => {
          let readTime = 0;
          for (let i = 0; i < outputData.blocks.length; i++) {
            // console.log(outputData.blocks[i].data);
            if (outputData.blocks[i].data?.text !== undefined) {
              readTime += readingTime(outputData.blocks[i]?.data?.text).time;
            }
            if (
              outputData.blocks[i].type === "image" ||
              outputData.blocks[i].type === "unsplash"
            ) {
              readTime += 8000;
            }
          }
          if (localStorage.getItem("articleId")) {
            // console.log('draf');
            dispatch(
              uploadArticle(
                {
                  main: {
                    writeup: JSON.stringify(outputData),
                    status: "DRAFT",
                    title: articleTitle,
                    body: articleDes,
                    articlePic: articleCover,
                    readingTime:
                      Math.ceil(readTime / 60000) === 1
                        ? `${Math.ceil(readTime / 60000)} min`
                        : `${readTime / 60000} mins`
                  },

                  qParams: {
                    writer: userUserName,
                    articleId: localStorage.getItem("articleId")
                  }
                },
                temp
              )
            );
          } else {
            // console.log('draf2');
            dispatch(
              uploadArticle(
                {
                  main: {
                    writeup: JSON.stringify(outputData),
                    status: "DRAFT",
                    title: articleTitle,
                    body: articleDes,
                    articlePic: articleCover,
                    readingTime:
                      Math.ceil(readTime / 60000) === 1
                        ? `${Math.ceil(readTime / 60000)} min`
                        : `${readTime / 60000} mins`
                  }
                },
                temp
              )
            );
          }
          // }
        })
        .then(() => {
          setIsSavingFirstTime(false);
        })
        .catch(error => {
          // console.log('Saving failed: ', error);
        });
      setUploadSuccess(false);
      setSaveDraftInitiate(true);
    }
  };

  useEffect(() => {
    if (articleCover !== "") {
      setNoImageFound(false);
    }
  }, [articleCover]);
  useEffect(() => {
    if (articleTitle !== "") {
      setNoTitleFound(false);
    }
  }, [articleTitle]);
  useEffect(() => {
    if (articleDes !== "") {
      setNoSubtitleFound(false);
      if (
        articleTitle !== "" &&
        !localStorage.getItem("articleId") &&
        !firstTimeSaved &&
        !isSavingFirstTime
      ) {
        setIsSavingFirstTime(true);
        setFirstTimeSaved(true);
        if (articleTitle !== "" && articleDes !== ""  && (!firstTimeImport || !state)) {
          counter = 0;

          const temp = getAuthToken();
          // console.log(decAccessToken, articleCover);
          editorInstance.current
            ?.save()
            .then(outputData => {
              let readTime = 0;
              for (let i = 0; i < outputData.blocks.length; i++) {
                // console.log(outputData.blocks[i].data);
                if (outputData.blocks[i].data?.text !== undefined) {
                  readTime += readingTime(outputData.blocks[i]?.data?.text)
                    .time;
                }
                if (
                  outputData.blocks[i].type === "image" ||
                  outputData.blocks[i].type === "unsplash"
                ) {
                  readTime += 8000;
                }
              }
              if (localStorage.getItem("articleId")) {
                // console.log('draf');
                dispatch(
                  uploadArticle(
                    {
                      main: {
                        writeup: JSON.stringify(outputData),
                        status: "DRAFT",
                        title: articleTitle,
                        body: articleDes,
                        articlePic: articleCover,
                        readingTime:
                          Math.ceil(readTime / 60000) === 1
                            ? `${Math.ceil(readTime / 60000)} min`
                            : `${readTime / 60000} mins`
                      },

                      qParams: {
                        writer: userUserName,
                        articleId: localStorage.getItem("articleId")
                      }
                    },
                    temp
                  )
                );
              } else {
                // console.log('draf2');
                dispatch(
                  uploadArticle(
                    {
                      main: {
                        writeup: JSON.stringify(outputData),
                        status: "DRAFT",
                        title: articleTitle,
                        body: articleDes,
                        articlePic: articleCover,
                        readingTime:
                          Math.ceil(readTime / 60000) === 1
                            ? `${Math.ceil(readTime / 60000)} min`
                            : `${readTime / 60000} mins`
                      }
                    },
                    temp
                  )
                );
              }
              // }
            })
            .then(() => {
              setIsSavingFirstTime(false);
            })
            .catch(error => {
              // console.log('Saving failed: ', error);
            });
          setUploadSuccess(false);
          setSaveDraftInitiate(true);
        }
      }
    }
  }, [articleDes]);

  const handleSaveAndNext = () => {
    setSaveClicked(false);
    if (articleTitle === "") {
      setNoTitleFound(true);
      setNotFoundErrorMsg("Please add story title");
    } else if (articleCover === "") {
      setNoImageFound(true);
      setNotFoundErrorMsg("Please add cover photo");
    } else if (articleDes === "") {
      setNoSubtitleFound(true);
      setNotFoundErrorMsg("Please add story subtitle");
    } else {
      setNoImageFound(false);
      setUploadSuccess(false);
      localStorage.setItem("articlePic", articleCover);
      localStorage.setItem("articleTitle", articleTitle);
      localStorage.setItem("articleDes", articleDes);
      localStorage.setItem("fullarticle", getArticleResp);
      localStorage.setItem(
        "publicationId",
        getArticleResp.article?.publicationId
      );
      localStorage.setItem(
        "articleStatus",
        JSON.parse(localStorage.getItem("article"))?.article?.status
      );
      if (
        JSON.parse(localStorage.getItem("article"))?.article?.status !==
          "PUBLISHED" ||
        localStorage.getItem("article") === null
      ) {
        setNextClicked(true);
        saveDraft();
      } else {
        editorInstance.current?.save().then(outputData => {
          localStorage.setItem("article", JSON.stringify(outputData));
        });
        navigate("/writerSettings");
      }
    }
  };

  const handleSave = () => {
    setSaveClicked(true);
    if (articleTitle === "") {
      setNoTitleFound(true);
      setNotFoundErrorMsg("Please add title");
    } else if (articleCover === "") {
      setNoImageFound(true);
      setNotFoundErrorMsg("Please add feature image");
    } else if (articleDes === "") {
      setNoSubtitleFound(true);
      setNotFoundErrorMsg("Please add subtitle");
    } else {
      setNoImageFound(false);
      setUploadSuccess(false);
      saveDraft();
      setNextClicked(false);
    }
  };

  var isCtrl = false;
  document.onkeyup = function(e) {
    if (e.keyCode === 17) isCtrl = false;
  };

  document.onkeydown = function(e) {
    if (e.keyCode === 17) isCtrl = true;
    if (e.keyCode === 83 && isCtrl === true) {
      // console.log('hiasd');
      handleSave();
      //run code for CTRL+S -- ie, save!
      return false;
    }
  };

  const iconClicked = () => {
    navigate("/");
  };

  return (
    <div>
      {!isGettingArticle ? (
        <div>
          {!alreadySignedIn && <Auth setAlreadySignedIn={setAlreadySignedIn} />}
          <div className={classes.saveBar} id="#e">
            <img
              src={iconOnly}
              className={classes.saveBaricon}
              alt="attention.com"
              style={{ cursor: "pointer" }}
              onClick={iconClicked}
            />
            <div className={classes.saveBarRight}>
              {(getArticleInitiate === false ||
                getArticleResp?.article?.status === "DRAFT") && (
                <>
                  <div className={classes.saveTimer}>
                    <div className={classes.saveTimerTitle}>Saved</div>
                    <div className={classes.saveTimerTime}>
                      {Math.ceil(counter / 60) === 1
                        ? `${Math.ceil(counter / 60)} min ago`
                        : `${Math.ceil(counter / 60)} mins ago`}
                    </div>
                  </div>

                  <Button
                    sx={{
                      "&.MuiButton-text": { color: "white" },
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: "0.9em",
                      textTransform: "capitalize",
                      background:
                        "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
                      borderRadius: "10px"
                    }}
                    style={{ marginRight: "4%", width: "8rem" }}
                    disabled={
                      isUploadingArticle || isGettingArticle || nextClicked
                    }
                    onClick={handleSave}
                  >
                    {isUploadingArticle && !nextClicked ? (
                      <CircularProgress size={20} style={{ color: "white" }} />
                    ) : (
                      `Save`
                    )}
                  </Button>
                </>
              )}
              <Button
                sx={{
                  "&.MuiButton-text": { color: "white" },
                  width: "25%",
                  fontFamily: "Poppins",
                  fontWeight: "700",
                  fontSize: "0.9em",
                  textTransform: "capitalize",
                  background:
                    "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
                  borderRadius: "10px"
                }}
                style={{ marginRight: "4%", width: "8rem" }}
                disabled={isUploadingArticle || isGettingArticle}
                onClick={handleSaveAndNext}
              >
                {isUploadingArticle && !saveClicked ? (
                  <CircularProgress size={20} style={{ color: "white" }} />
                ) : (
                  `Next`
                )}
              </Button>
            </div>
          </div>
          {(noImageFound || noTitleFound || noSubtitleFound) && (
            <LoginError message={notFoundErrorMsg} />
          )}
          <CoverPhoto
            setArticleTitle={setArticleTitle}
            setArticleDes={setArticleDes}
            setArticleCover={setArticleCover}
            articleTitle={articleTitle}
            articleDes={articleDes}
            articleCover={articleCover}
            articleId={getArticleResp?.article?.articleId}
            getArticleSuccess={getArticleSuccess}
            readingTimeLive={readingTimeLive}
          />
        </div>
      ) : (
        <MainLoader />
      )}
      <div className={classes.writerInfo}>
        <div className={classes.writerPicAndName}></div>
        <div className={classes.writerFollow}></div>
      </div>
      <Container
        style={{
          backgroundColor: "white",
          minHeight: "100vh",
          minWidth: "90vw",
          // marginTop: "2rem",
        }}
        maxWidth="xl"
      >
        <Box p={2}>
          <Box>
            <div id="editorjs" className={classes.editor}></div>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

const LoginError = ({ message }) => {
  const classes = useStyles();
  return (
    <div className={classes.loginErrorContainer}>
      <div className={classes.loginError}>
        <div className={classes.loginErrorSVG}>
          <svg
            width="17"
            height="15"
            viewBox="0 0 17 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.2312 0.982933L16.729 12.0512C17.0903 12.6667 17.0903 13.4016 16.729 14.0171C16.3676 14.6325 15.7204 15 14.9978 15H2.00218C1.27949 15 0.63236 14.6326 0.271011 14.0171C-0.0903371 13.4016 -0.0903371 12.6667 0.271011 12.0512L6.76881 0.982933C7.13013 0.367482 7.77732 0 8.49998 0C9.22268 0 9.86984 0.367482 10.2312 0.982933ZM14.9978 14.0206C15.3604 14.0206 15.6851 13.8362 15.8664 13.5274C16.0477 13.2185 16.0477 12.8498 15.8665 12.541L9.36864 1.4727C9.18735 1.16387 8.86259 0.979505 8.50002 0.979505C8.13741 0.979505 7.81268 1.16387 7.63139 1.4727L1.13353 12.541C0.952238 12.8498 0.952238 13.2185 1.13353 13.5274C1.31482 13.8362 1.63954 14.0206 2.00218 14.0206H14.9978Z"
              fill="black"
            />
            <rect x="8" y="5" width="1" height="5" fill="black" />
            <path
              d="M8.5 11C8.2243 11 8 11.2243 8 11.5C8 11.7757 8.2243 12 8.5 12C8.77568 12 9 11.7757 9 11.5C9 11.2243 8.7757 11 8.5 11Z"
              fill="black"
            />
          </svg>
        </div>
        <div className={classes.loginErrorMsg}>{message}</div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  editor: {
    lineHeight:'2.1rem',
  },
  writerInfo: {
    border: "1px solid #979797",
    width: "fit-content",
    borderRadius: "20px"
  },
  saveBar: {
    width: "100%",
    // marginTop: '4rem',
    display: "flex",
    justifyContent: "space-between",
    alginItems: "center",
    padding: "0.5% 0% 0.5% 0%",
    zIndex: 4
    // zIndex: 1,
  },

  editorHidden: {
    visibility: "hidden"
  },

  editorVisible: {
    visibility: "visible"
  },

  saveBaricon: {
    width: "40px",
    marginLeft: "1%"
  },

  saveBarRight: {
    display: "flex"
  },

  saveBarButton: {
    background: "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
    color: "white",
    fontWeight: "bold",
    padding: "1% 2% 1% 2%",
    borderRadius: "5px",
    marginRight: "4%",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100px"
  },

  saveTimer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginRight: "4%",
    width: "100px"
  },

  saveTimerTitle: {
    color: "rgba(89, 201, 149, 1)",
    fontWeight: "bold"
  },

  saveTimerTime: {
    color: "rgba(150, 150, 150, 1)",
    fontSize: "10px"
  },

  loginErrorContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  loginError: {
    display: "flex",
    backgroundColor: "#FFBBBA",
    width: "20%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "1% 0% 1% 0%",
    justifyContent: "space-around",
    marginTop: "2%",
    height: "0.8rem",
    position: "absolute"
  },

  loginErrorSVG: {
    margin: "-0.3% 5% 0% 5%"
  },

  loginErrorMsg: {
    display: "flex",
    alignItems: "center",
    width: "90%"
  }
});

export default WriterEditor;
