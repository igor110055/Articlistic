import { makeStyles } from "@mui/styles";
function StoryCoverPhoto({
  writerName,
  body,
  title,
  articlePic,
  readingTime,
  date,
}) {
  const classes = useStyles();

  return (
    <div>
      <img src={articlePic} alt="coverphoto" className={classes.imageStyle} />
      <div
        className={classes.captionContainer}
        // style={{ backgroundImage: `url(${backgroundSVG})` }}
      >
        <div
          className={classes.captionAndDescription}
          style={{ padding: "1rem" }}
        >
          <h3 className={classes.captionStyle}>{title}</h3>
          <h2 className={classes.desCaptionStyle}>{body}</h2>
        </div>
      </div>
    </div>
  );
}
const useStyles = makeStyles({
  imageStyle: {
    width: "100%",
    height: "70vh",
    maxHeight: "35rem",
    objectFit: "cover",
  },
  captionContainer: {
    // marginTop: "-11rem",
    // filter: "blur(0px)",
    padding: "0.5rem",
    overflow: "hidden",
    // background: "#191F28",
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
    // maxWidth: "100%",
    // minWidth: "50%",
    textWrap: "wrap",
    // textAlign: 'justify',
    outline: "none",
    border: "none",
    background: "transparent",
    zIndex: 1,
    fontSize: "48px",
    lineHeight: "45px",
    letterSpacing: "-0.145833px",
    fontFamily: "Merriweather",
    resize: "none",
    margin: 0,
    color: "#1A1A1A",
    // textAlignLast: 'center',
    // textAlign: 'center',
    // textAlignLast: 'left',
  },

  desCaptionStyle: {
    // textAlign: 'center',
    outline: "none",
    border: "none",
    background: "transparent",
    zIndex: 1,
    resize: "none",
    fontWeight: "100",
    fontSize: "27px",
    lineHeight: "40px",
    letterSpacing: "-0.105px",
    fontFamily: "Merriweather",
    color: "#757575",
    margin: "9px 0",
  },
});

export default StoryCoverPhoto;
