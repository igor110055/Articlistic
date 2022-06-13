import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
// import Marker from "@editorjs/marker";
import SimpleImage from "@editorjs/simple-image";

import TempBlock from "../writerEditor/tempBlock";
import SpotifyBlock from "../writerEditor/spotifyBlock/spotifyBlock";
import DelimiterBlock from "../writerEditor/delimiterBlock/delimliterBlock";
import QuoteBlock from "../writerEditor/quoteBlock/quoteBlock";
import NftBlock from "../writerEditor/nftBlock/nftBlock";
import CodeBlock from "../writerEditor/codeBlock/codeBlock";
import VideoBlock from "../writerEditor/videoBlock/videoBlock";
import ImageUploadBlock from "../writerContent/imageUploadBlock/imageUploadBlock";
// import { TwitterScriptHandler } from "../../utils/twitterHandler";
import Paragraph from "../writerEditor/paragraph";
import { useRef, useEffect } from "react";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
function StoryEditor({ storyData }) {
  const editorInstance = useRef();
  const classes = useStyles();

  useEffect(() => {
    // console.log(storyData);
    startEditor();
    // console.log("started ediotr");
  }, []);
  const startEditor = () => {
    // console.log('ajs');
    const editor = new EditorJS({
      inlineToolbar: true,
      onReady: () => {
        editorInstance.current = editor;
        // setCheck(true);
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
            fontSize: "16px",
            // fontFamily: 'Merriweather',
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
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
          inlineToolbar: ["link"],
        },
        // twitter: {
        //   class: Twitter
        // },
        video: VideoBlock,
        spotify: SpotifyBlock,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
              spotify: {
                regex:
                  /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/,
                embedUrl:
                  "https://embed.spotify.com/?uri=https://open.spotify.com/track/6teW0qt23aGnWhC0rSvtoz?si=a02a9857240a4e44",
                html: "<iframe src='https://embed.spotify.com/?uri=https://open.spotify.com/track/6teW0qt23aGnWhC0rSvtoz?si=39d59b3cb3134df5' width='100%' height='380' frameBorder='0' allowfullscreen=' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'></iframe>",
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
        //   shortcut: "CMD+SHIFT+M"
        // }
      },

      data: storyData,
      readOnly: true,
      autofocus: true,

      // placeholder: 'Write your story!',
    });

    console.log("works");
  };

  return (
    <div>
      <div className={classes.editorVisible}>
        <div id="editorjs" className={classes.editor}></div>
      </div>
    </div>
  );
}

export default StoryEditor;
const useStyles = makeStyles({
  editor: {
    display: "inline-block",
    backgroundColor: "#FFFFFF",
    fontFamily: "Poppins",
    width: "100%",
    color: "#616161",
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
