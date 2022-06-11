import { makeStyles } from "@mui/styles";
import backgroundSVG from "../../../Images/banner-background.svg";
import userImage from "../../../Images/user-image.png";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
// import { useEffect } from "react";
// import { format } from "crypto-js";

function StoryCoverPhoto({
  writerName,
  body,
  title,
  articlePic,
  readingTime,
  date
}) {
  const classes = useStyles();


  return (
    <div>
      <img src={articlePic} alt="coverphoto" className={classes.imageStyle} />
      <div
        className={classes.captionContainer}
        style={{ backgroundImage: `url(${backgroundSVG})` }}
      >
        <div
          className={classes.captionAndDescription}
          style={{ padding: "1rem" }}
        >
          <h3 className={classes.captionStyle}>{title}</h3>
          <h2 className={classes.desCaptionStyle}>{body}</h2>
        </div>
      </div>
      {/* <div className={classes.writerInfoContainer}>
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
                {writerName}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#636363",
                  fontWeight: "600"
                }}
              >
                {formatDate(date)}· {readingTime} read
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
      </div> */}
    </div>
  );
}
const useStyles = makeStyles({
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
    resize: "none",
    margin: 0
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
    resize: "none",
    fontWeight: "100"
  },

});

export default StoryCoverPhoto;
