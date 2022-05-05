import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { userUsername } from "../user/userActions";

import { useLocation, useNavigate } from "react-router-dom";

import { getPublications } from "./writerActions";
import { getAuthToken } from "../common/commonFunctions";
import { PublicationTextField, validateURL } from "../../utils/common";
import { Modal, Box } from "@material-ui/core";
import { baseURL } from "../../utils/apiEndPoints";
import axios from "axios";

const WriterContent = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [myStoryClass, setMyStoryClass] = useState(``);
  const [importLink, setImportLink] = useState("");
  const [importArticleData, setImportArticleData] = useState({});
  const [importError, setImportError] = useState("");
  const [dashboardClass, setDashboardClass] = useState(
    `${classes.saveBarLeftSelected}`
  );
  const [communityClass, setCommunityClass] = useState(``);
  const [publicationClass, setPublicationClass] = useState(``);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const location = useLocation();

  /**
   * The function is called when the user clicks on the My Stories button.
   *
   * The function sets the class of the My Stories button to the selected class.
   */
  const handleClickMyStories = () => {
    setMyStoryClass(`${classes.saveBarLeftSelected}`);
    setDashboardClass("");
    setCommunityClass("");
    setPublicationClass("");
    navigate("/writerDashboard/stories");
  };
  const handleClickDashboard = () => {
    setDashboardClass(`${classes.saveBarLeftSelected}`);
    setMyStoryClass(``);
    setCommunityClass("");
    setPublicationClass("");
    navigate("/writerDashboard");
  };
  const handleClickCommunity = () => {
    setCommunityClass(`${classes.saveBarLeftSelected}`);
    setDashboardClass(``);
    setMyStoryClass(``);
    setPublicationClass("");
    navigate("/writerDashboard/community");
  };

  const handleClickPublication = () => {
    setPublicationClass(`${classes.saveBarLeftSelected}`);
    setDashboardClass(``);
    setMyStoryClass(``);
    setCommunityClass("");
    navigate("/writerDashboard/publications");
  };

  // const selectedLinkStyle = {
  //   border: "1px solid rgba(151, 151, 151, 0.3)",
  //   borderRadius: "10px",
  // };

  const {
    isUploadingArticle,
    // uploadArticleError,
    publicationsData,
    // uploadArticleResp,
  } = useSelector((state) => ({
    isUploadingArticle: state.writerEditor.isUploadingArticle,
    uploadArticleError: state.writerEditor.uploadArticleError,
    publicationsData: state.writerContent.publicationsData,
    uploadArticleResp: state.writerEditor.uploadArticleResp,
  }));

  const dispatch = useDispatch();

  /* Used to clear the local storage when the user navigates to the story page. */
  useEffect(() => {
    if (localStorage.getItem("articleId")) {
      localStorage.removeItem("article");
      localStorage.removeItem("articlePic");
    }
    dispatch(
      userUsername(JSON.parse(localStorage.getItem("user"))?.userUserName)
    );
    const token = getAuthToken();
    dispatch(
      getPublications({
        token,
        userUserName: JSON.parse(localStorage.getItem("user"))?.userUserName,
      })
    );
  }, []);

  /**
   * * If there are no publications, create one.
   * * Otherwise, navigate to the story page
   * @returns The `handleCreateArticle` function is being returned.
   */
  const handleCreateArticle = () => {
    localStorage.removeItem("articleId");
    if (publicationsData.length === 0) {
      handleClickPublication();
      return;
    }
    navigate("/story");
  };

  const handleImport = async () => {
    if (importLink === "" || !validateURL(importLink)) {
      setImportError("Please enter a valid Subtack URL.");
      return
    }

    const temp = getAuthToken();
    try {
      setImportLoading(true);
      const response = await axios.get(
        `${baseURL}/articles/import?link=${importLink}`,
        {
          headers: {
            Authorization: temp,
          },
        }
      );
      setImportArticleData(response.data);
      const { HTML: html, heading, subtitle } = response.data.scrapedArticle;
      if(!html){
        setImportError("Please enter a valid Subtack URL.");
        setImportLoading(false)
        return
      }
      setImportLoading(false);
      localStorage.removeItem('articleId')
      navigate("/story", { state: { html, heading, subtitle, articleId: response.data.articleId, originUrl: importLink } });
    } catch (e) {
      setImportError("Please enter a valid Subtack URL.");
    }

    //   localStorage.setItem('articleId', 'f12b416e-a347-4201-95b8-baa117caf41f')
  };

  const handleOpenImport = () => {
    setImportModalOpen(true);
  };

  return (
    <div>
      <div className={classes.saveBar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              color: "rgba(255, 167, 0, 1)",
              fontWeight: "600",
              fontSize: "1.6em",
              width: "21rem",
              paddingLeft: "2%",
            }}
          >
            Writing Studio
          </div>
          <div className={classes.saveBarLeft}>
            <div
              style={{
                color: "rgba(99, 99, 99, 1)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "1.2% 0% 1.2% 0%",
                width: "9.125em",
                textAlignLast: "center",
              }}
              // className={dashboardClass}
              onClick={handleClickDashboard}
              className={
                location.pathname === "/writerDashboard"
                  ? classes.saveBarLeftSelected
                  : ""
              }
            >
              Dashboard
            </div>
            <div
              style={{
                color: "rgba(99, 99, 99, 1)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "1.2% 0% 1.2% 0%",
                width: "9.125em",
                textAlignLast: "center",
              }}
              // className={myStoryClass}
              onClick={handleClickMyStories}
              className={
                location.pathname === "/writerDashboard/stories"
                  ? classes.saveBarLeftSelected
                  : ""
              }
            >
              My Stories
            </div>
            <div
              style={{
                color: "rgba(99, 99, 99, 1)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "1.2% 0% 1.2% 0%",
                width: "9.125em",
                textAlignLast: "center",
              }}
              // className={communityClass}
              onClick={handleClickCommunity}
              className={
                location.pathname === "/writerDashboard/community"
                  ? classes.saveBarLeftSelected
                  : ""
              }
            >
              Community
            </div>
            <div
              style={{
                color: "rgba(99, 99, 99, 1)",
                marginLeft: "14px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                padding: "1.2% 0% 1.2% 0%",
                width: "9.125em",
                textAlignLast: "center",
              }}
              // className={publicationClass}
              onClick={handleClickPublication}
              className={
                location.pathname === "/writerDashboard/publications"
                  ? classes.saveBarLeftSelected
                  : ""
              }
            >
              My Publications
            </div>
          </div>
        </div>
        <div className={classes.saveBarRight}>
          <Button
            sx={{
              "&.MuiButton-text": { color: "white" },
              fontFamily: "Poppins",
              fontSize: "0.8em",
              textTransform: "capitalize",
              borderRadius: "10px",
              background:
                "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
            }}
            style={{ marginRight: "1rem", width: "10rem", height: "34px" }}
            onClick={handleOpenImport}
          >
            <h3>Import Story</h3>
          </Button>
          <Button
            sx={{
              "&.MuiButton-text": { color: "white" },
              fontFamily: "Poppins",
              fontSize: "0.8em",
              textTransform: "capitalize",
              borderRadius: "10px",
              background:
                "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
            }}
            style={{ marginRight: "1rem", width: "10rem", height: "34px" }}
            disabled={isUploadingArticle}
            onClick={handleCreateArticle}
          >
            {isUploadingArticle ? (
              <CircularProgress size={20} style={{ color: "white" }} />
            ) : (
              <h3>Create Story</h3>
            )}
          </Button>
        </div>
      </div>
      <Modal
        open={importModalOpen}
        onClose={() => {
          setImportLink("");
          setImportError("");
          setImportModalOpen(false);
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer1}>
          <div className={classes.importForm}>
            <h1 className={classes.heading}> Import Story </h1>
            <div className={classes.titleContainer}>
              Import a story from Substack. Support for Medium and personal blog
              coming soon.
            </div>
            <div className={classes.subtitleContainer}>
              A canonical URL will be automatically added for the imported
              story, you can edit it before publishing.
            </div>
            <PublicationTextField
              onChange={(e) => {
                setImportError("");
                setImportLink(e.target.value.substring(0, 80));
              }}
              fullWidth
              required
              value={importLink}
              error={importError ? true : false}
              helperText={
                <div style={{ fontFamily: "Poppins" }}>{importError}</div>
              }
              label="Link URL"
              inputProps={{
                style: {
                  fontFamily: "Poppins",
                  color: "#636363",
                  fontSize: "14px",
                  height: "18px",
                  maxLength: 30,
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: "500",
                },
              }}
              style={{ width: "518px", marginTop: "1rem" }}
            />
            <Button
              sx={{
                "&.MuiButton-text": { color: "white" },
                fontFamily: "Poppins",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "capitalize",
                borderRadius: "10px",
                background:
                  "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
              }}
              style={{
                width: "20rem",
                height: "2.5rem",
                marginTop: "28px",
                padding: "1.3rem",
                lineHeight: "27px",
              }}
              onClick={handleImport}
            >
              {importLoading ? (
                <CircularProgress size={20} style={{ color: "white" }} />
              ) : (
                <h3>Import Story</h3>
              )}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const useStyles = makeStyles({
  saveBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alginItems: "center",
    boxShadow: "0px 2px 24px rgba(199, 212, 223, 0.37612)",
    padding: "0.3% 0% 0.3% 0%",
    height: "3rem",
    backgroundColor: "white",
    zIndex: 1,
  },

  saveBaricon: {
    width: "40px",
    marginLeft: "1%",
  },

  formContainer1: {
    backgroundColor: "white",
    margin: "auto",
    width: "37rem",
    height: "24rem",
    marginTop: "10rem",
    borderRadius: "20px",
    outline: "none",
  },

  heading: {
    color: "#636363",
    fontSize: "25px",
    alignSelf: "center",
    marginTop: "26px",
    marginBottom: "0px",
    fontStyle: "bold",
  },

  titleContainer: {
    fontSize: "1.1rem",
    color: "#919191",
    alignSelf: "center",
    textAlign: "left",
    lineHeight: "32px",
    // marginLeft: '2.2rem',
    marginTop: "0.9rem",
  },

  subtitleContainer: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#919191",
    lineHeight: "25px",
    alignSelf: "center",
    textAlign: "left",
    marginTop: "0.9rem",
  },

  importForm: {
    // padding: "27px",
    display: "flex",
    margin: "26px 38px 40px 39px",
    // gap: "15px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },

  saveBarLeft: {
    display: "flex",
    width: "60%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "1%",
  },

  saveBarLeftSelected: {
    border: "1px solid rgba(151, 151, 151, 0.3)",
    borderRadius: "10px",
  },

  saveBarRight: {
    display: "flex",
    alignItems: "center",
  },
});

export default WriterContent;
