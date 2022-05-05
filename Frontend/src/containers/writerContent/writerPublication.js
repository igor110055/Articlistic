import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthToken } from "../common/commonFunctions";
import { getPublications } from "./writerActions";
import { makeStyles } from "@mui/styles";
import defaultPublicationImg from './../../Images/defaultPublication.jpg'
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Modal,
  Paper,
  Snackbar,
} from "@mui/material";
import { Box } from "@mui/system";
import WriterPublicationForm from "../../components/writerPublicationForm";
import UpdatePublicationForm from "../../components/updatePublicationForm";
import { useNavigate } from "react-router-dom";

//  Displays all publication related to user
const WriterPublication = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicationSelected, setPublicationSelected] = useState();
  const [isManagePublicationOpen, setIsManagePublicationOpen] = useState(false);
  const navigate = useNavigate();

  // getting publications state
  const {
    publicationsData,
    isCreatingPublication,
    isGettingPublications,
    publicationsError,
    isUpdatingPublication,
    infoMsg,
    userUserName,
  } = useSelector((state) => ({
    publicationsData: state.writerContent.publicationsData,
    isCreatingPublication: state.writerContent.isCreatingPublication,
    isGettingPublications: state.writerContent.isGettingPublications,
    publicationsError: state.writerContent.publicationsError,
    infoMsg: state.writerContent.infoMsg,
    isUpdatingPublication: state.writerContent.isUpdatingPublication,
    userUserName: state.user.userUserName,
  }));

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeManageModal = () => {
    setIsManagePublicationOpen(false);
  };

  useEffect(() => {
    if (!publicationsData) {
      const token = getAuthToken();
      dispatch(
        getPublications({
          token,
          userUserName,
        })
      )
    }
  }, []);

  const classes = useStyles();

  if (isGettingPublications || isCreatingPublication || isUpdatingPublication) {
    return (
      <div
        className={classes.publicationPresentContainer}
        style={{ paddingTop: "45px" }}
      >
        <CircularProgress size={20} style={{ color: "#0095FF" }} />
      </div>
    );
  }

  return (
    <>
      {publicationsData?.length === 0 ? (
        <div className={classes.publicationContainer}>
           <Avatar
                        sx={{ bgcolor: "pink", width: 96, height: 90, marginBottom: '16px' }}
                        src={
                          defaultPublicationImg
                        }
                      />
          <div className={classes.publishButton}>

            <Button
              onClick={() => setIsModalOpen(true)}
              sx={{
                "&.MuiButton-text": { color: "white" },
                fontFamily: "Poppins",
                fontSize: "0.8em",
                textTransform: "capitalize",
                borderRadius: "10px",
                background:
                  "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
              }}
              style={{ marginRight: "1rem", width: "19rem", height: "38px" }}
            >
              <h3>Create Your First Publication <span style={{fontSize: '1.2rem'}}>🎉</span></h3>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={classes.publicationPresentContainer}>

            {publicationsData.map((publication) => {
              return (
                <div
                  key={publication.publicationId}
                  className={classes.publicationCard}
                >

                  <Box
                    className={classes.publicationBox}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {publication.publicationPic ? (
                    /* This is a trick to force the browser to reload the image as AWS uses the same URL for updated images. */
                      <Avatar
                        src={`${publication.publicationPic}?${new Date().getTime()}`}
                        sx={{ width: 96, height: 90 }}
                      />
                    ) : (
                      <Avatar
                        sx={{ bgcolor: "pink", width: 96, height: 90 }}
                        src={
                         defaultPublicationImg
                        }
                      />
                    )}
                    <span
                      className={classes.publicationName}
                      onClick={() => {
                        navigate("/publication/about", { state: publication });
                      }}
                    >
                      {publication.publicationName}
                    </span>
                  </Box>
                  <Box>
                    <div
                      onClick={() => {
                        setPublicationSelected(publication);
                        setIsManagePublicationOpen(true);
                      }}
  
                      className={classes.publicatonBtn}
                    >
                      Manage
                    </div>
                  </Box>
                </div>
              );
            })}
            <div className={classes.publicationContainer2}>
              <div className={classes.publishButton}>
                <div className={classes.connectedLine}></div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  sx={{
                    "&.MuiButton-text": { color: "white" },
                    fontFamily: "Poppins",
                    fontSize: "0.8em",
                    textTransform: "capitalize",
                    borderRadius: "10px",
                    background:
                      "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
                  }}
                  style={{
                    width: "15rem",
                    height: "38px",
                  }}
                >
                  <h3>Create Publication</h3>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer1}>
          <WriterPublicationForm closeModal={closeModal} />
        </Box>
      </Modal>
      <Modal
        open={isManagePublicationOpen}
        onClose={() => setIsManagePublicationOpen(false)}
      >
        <Box className={classes.formContainer2}>
          <UpdatePublicationForm
            closeModal={closeManageModal}
            publication={publicationSelected}
          />
        </Box>
      </Modal>
    </>
  );
};

const useStyles = makeStyles({
  information: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#F6F6F7",
  },

  publicationContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
    minHeight: "calc(100vh - 8rem)",
    backgroundColor: "#F6F6F7",
    boxShadow: "20px -1px 64px rgba(214, 230, 255, 0.5)",
    borderRadius: "20px",
  },

  publicationContainer2: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },

  publication: {
    padding: "1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5rem",
    alignItems: "center",
    height: "5rem",
    width: "1003px",
    borderRadius: "28px",
    borderWidth: "5px",
    backgroundColor: "white",
    border: "0.2px solid rgba(151, 151, 151, 0.3)",
    borderColor: "#0095FF",
    // borderRadius: '10px',
  },

  publicationPresentContainer: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "calc(100vh - 8rem)",
    backgroundColor: "#F6F6F7",
  },

  publicationCard: {
    padding: "1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "1rem",
    alignItems: "center",
    height: "5rem",
    width: "800px",
    // borderRadius: "28px",
    // borderWidth: "5px",
    backgroundColor: "white",
    boxShadow: "20px -1px 64px rgba(214, 230, 255, 0.5)",
    borderRadius: "20px",
    // backgroundColor: 'red'
    // borderRadius: '10px',
  },

  formContainer2: {
    backgroundColor: "white",
    margin: "auto",
    width: "28rem",
    height: "34rem",
    marginTop: "2rem",
    borderRadius: "28px",
    outline: "none",
  },

  formContainer1: {
    backgroundColor: "white",
    margin: "auto",
    width: "28rem",
    height: "32rem",
    marginTop: "2rem",
    borderRadius: "28px",
    outline: "none",
  },

  connectedLine: {
    // width: "2px",
    // backgroundColor: "#2B56FF",
    borderLeft: "3px dashed #2B56FF",
    height: "100px",
    height: "5rem",
  },

  publishButton: {
    height: "5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "25rem",
  },

  publicatonBtn: {
    // border: "1px solid rgba(151, 151, 151, 0.3)",
    borderRadius: "10px",
    border: '2px solid #CFCFCF',
    color: "rgba(99, 99, 99, 1)",
    fontSize: "14px",
    fontFamily: 'Poppins',
    fontWeight: '500',
    marginBottom: '4px',
    cursor: "pointer",
    height: '1.5rem',
    padding: "1.2% 0% 1.2% 0%",
    width: "9.125em",
    textAlignLast: "center",
  },

  publicationBox: {
    height: "5rem",
  },

  publicationName: {
    paddingLeft: "2.5rem",
    fontWeight: "600",
    fontSize: "16px",
    fontStyle: "normal",
    cursor: "pointer",
    fontFamily: "Poppins",
    lineHeight: "30px",
    letterSpacing: "-0.11px",
    color: "#636363",
  },
});

export default WriterPublication;
