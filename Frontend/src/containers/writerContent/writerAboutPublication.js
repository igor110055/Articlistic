import { useEffect, useRef, useState } from "react";
import {  Box} from "@mui/material";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import Marker from "@editorjs/marker";
import TempBlock from "../writerEditor/tempBlock";
import SpotifyBlock from "../writerEditor/spotifyBlock/spotifyBlock";
import DelimiterBlock from "../writerEditor/delimiterBlock/delimliterBlock";
import QuoteBlock from "../writerEditor/quoteBlock/quoteBlock";
import NftBlock from "../writerEditor/nftBlock/nftBlock";

import Cookie from "js-cookie";
import { useNavigate } from "react-router";
import { userUsername } from "../user/userActions";
import CodeBlock from "../writerEditor/codeBlock/codeBlock";
import VideoBlock from "../writerEditor/videoBlock/videoBlock";
import MainLoader from "../../components/mainLoader";
import "./../../index.css";
import Auth from "../../components/auth";
import { getAboutPublication } from "./writerActions";
import { getAuthToken } from "../common/commonFunctions";
import ImageUploadBlock from "./imageUploadBlock/imageUploadBlock";

const WriterAboutPublication = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const [editorData, setEditorData] = useState();
  const [getAboutInitiate, setGetAboutInitiate] = useState(false)
  const [startTimer, setStartTimer] = useState(false);

  let [counter, setCounter] = useState(0);

  const {
    userUserName,
    aboutPublication,
    isGettingAboutPublication,
  } = useSelector((state) => ({
    isUpdatingAboutPublication: state.writerContent.isUpdatingAboutPublication,
    isGettingAboutPublication: state.writerContent.isGettingAboutPublication,
    userUserName: state.user.userUserName,
    aboutPublication: state.writerContent.aboutPublication,
    isGettingArticle: state.writerEditor.isGettingArticle,
    updateAboutError: state.writerEditor.updateAboutError,
  }));

  const [alreadySignedIn, setAlreadySignedIn] = useState(false);
  const { state } = useLocation();

  const { publicationId = "", publicationName = "", intro } = state || {};
  const editorInstance = useRef();

  if (!publicationId) {
    navigate("/writerDashboard");
  }

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
    const token = getAuthToken();
    dispatch(getAboutPublication({ token, publicationId }));
    setGetAboutInitiate(true)
  }, []);

  const startEditor = () => {
    // console.log('ajs');
    const editor = new EditorJS({
      inlineToolbar: true,
      onReady: () => {
        editorInstance.current = editor;
        setCheck(true);
        try {
          new Undo({ editor });
        } catch {}
        try {
          new DragDrop(editor);
        } catch {}
        // setInterval(() => {
        //     saveDraft();
        // }, 120000);
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Publication Title",
            levels: [1, 2, 3],
            defaultLevel: 1,
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
        video: VideoBlock,
        spotify: SpotifyBlock,
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
        Marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },
      },

      data: aboutPublication,
      readOnly: true,
      autofocus: true,

      // placeholder: 'Write your story!',
    });
  };

  useEffect(() => {
    if (Cookie.get("oneDayBeforeAccessToken")) {
      setAlreadySignedIn(true);
    } else {
      setAlreadySignedIn(false);
    }
    dispatch(
      userUsername(JSON.parse(localStorage.getItem("user"))?.userUserName)
    );
  }, []);

  useEffect(() => {
    if (!editorInstance.current && editorData) {
      startEditor();
    }
    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, [editorData]);


  useEffect(() => {
    if(!isGettingAboutPublication && getAboutInitiate){
      setEditorData(aboutPublication)
    }
  },[isGettingAboutPublication])

 

  const dispatch = useDispatch();

  useEffect(() => {
    if (userUserName !== "") {
      setInterval(() => {
        setCounter((counter) => (counter === 120 ? 0 : counter + 1));
      }, 1000);
    }
  }, [startTimer]);

  return (
    <div>
      {!isGettingAboutPublication ? (
        <div>
          {!alreadySignedIn && <Auth setAlreadySignedIn={setAlreadySignedIn} />}
        </div>
      ) : (
        <MainLoader />
      )}
      <Box p={5}>
        <Box
          className={
            isGettingAboutPublication
              ? classes.editorHidden
              : classes.editorVisible
          }
        >
          <div id="editorjs" className={classes.editor}></div>
        </Box>
      </Box>
      {/* </Container> */}
    </div>
  );
};

const useStyles = makeStyles({
  editor: {
    backgroundColor: "#F6F6F7",
    fontFamily: 'Poppins'
  },

  saveBar: {
    width: "100%",
    // marginTop: '4rem',
    display: "flex",
    justifyContent: "space-between",
    alginItems: "center",
    padding: "0.5% 0% 0.5% 0%",
    zIndex: 4,
    // zIndex: 1,
  },

  editorHidden: {
    visibility: "hidden",
  },

  editorVisible: {
    visibility: "visible",
  },

  saveBaricon: {
    width: "40px",
    marginLeft: "1%",
  },

  saveBarRight: {
    display: "flex",
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
    width: "100px",
  },

  saveTimer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginRight: "4%",
    width: "100px",
  },

  saveTimerTitle: {
    color: "rgba(89, 201, 149, 1)",
    fontWeight: "bold",
  },

  saveTimerTime: {
    color: "rgba(150, 150, 150, 1)",
    fontSize: "10px",
  },

  loginErrorContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  loginError: {
    display: "flex",
    backgroundColor: "#FFBBBA",
    width: "20%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "1.4% 0% 1.4% 0%",
    justifyContent: "space-around",
    marginTop: "2%",
    height: "0.8rem",
    position: "absolute",
  },

  loginErrorSVG: {
    margin: "-0.3% 5% 0% 5%",
  },

  loginErrorMsg: {
    display: "flex",
    alignItems: "center",
    width: "90%",
  },
});

export default WriterAboutPublication;
