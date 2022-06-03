import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthToken } from "../common/commonFunctions";
import { getPublications } from "./writerActions";
import { makeStyles } from "@mui/styles";
import defaultPublicationImg from "./../../Images/defaultPublication.jpg";
import {
  Avatar,
  Button,
  CircularProgress,
  Modal
} from "@mui/material";
import { Box } from "@mui/system";
import WriterPublicationForm from "../../components/writerPublicationForm";
import UpdatePublicationForm from "../../components/updatePublicationForm";
import { useNavigate } from "react-router-dom";
import "./writerPublication.css";

//  Displays all publication related to user
const WriterPublication = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicationSelected, setPublicationSelected] = useState();
  const [isManagePublicationOpen, setIsManagePublicationOpen] = useState(false);

  const navigate = useNavigate();

  const [curDate, setCurDate] = useState(Date.now());

  //change after one minute is elapsed
  useEffect(() => {
    setInterval(() => {
      setCurDate(Date.now());
    }, 60000);
  }, []);

  // getting publications state
  const {
    publicationsData,
    isCreatingPublication,
    isGettingPublications,
    // publicationsError,
    isUpdatingPublication,
    // infoMsg,
    userUserName
  } = useSelector(state => ({
    publicationsData: state.writerContent.publicationsData,
    isCreatingPublication: state.writerContent.isCreatingPublication,
    isGettingPublications: state.writerContent.isGettingPublications,
    publicationsError: state.writerContent.publicationsError,
    infoMsg: state.writerContent.infoMsg,
    isUpdatingPublication: state.writerContent.isUpdatingPublication,
    userUserName: state.user.userUserName
  }));

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeManageModal = () => {
    setIsManagePublicationOpen(false);
  };

  //To convert Milliseconds into hours and minutes
  const convertIntoHoursAndMinutes = timeInMillie => {
    let res = "";

    if (timeInMillie <= 0) res = "Deleting Soon";
    else {
      const timeInMinutes = timeInMillie / 60000;

      const hours = Math.floor(timeInMinutes / 60);
      const minutes = Math.floor(timeInMinutes % 60);

      if (hours >= 1) res += `${hours}h `;
      if (minutes >= 1) res += `${minutes}m`;

      if (res === "") res = "Deleting Soon";
    }

    return res;
  };

  useEffect(() => {
    // console.log(publicationsData);
    if (!publicationsData) {
      const token = getAuthToken();
      dispatch(
        getPublications({
          token,
          userUserName
        })
      );
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
            sx={{
              bgcolor: "pink",
              width: 96,
              height: 90,
              marginBottom: "16px"
            }}
            src={defaultPublicationImg}
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
                  "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)"
              }}
              style={{ marginRight: "1rem", width: "19rem", height: "38px" }}
            >
              <h3>
                Create Your First Publication{" "}
                <span style={{ fontSize: "1.2rem" }}>🎉</span>
              </h3>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={classes.publicationPresentContainer}>
            {publicationsData.map(publication => {
              return (
                <div
                  key={publication.publicationId}
                  className={classes.publicationCard}
                >
                  <Box
                    className={classes.publicationBox}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {publication.deleteAt && (
                      <div>
                        {publication.publicationPic ? (
                          /* This is a trick to force the browser to reload the image as AWS uses the same URL for updated images. */
                          <Avatar
                            src={`${
                              publication.publicationPic
                            }?${new Date().getTime()}`}
                            sx={{
                              width: 96,
                              height: 90,
                              filter: "grayscale(1)"
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              bgcolor: "pink",
                              width: 96,
                              height: 90,
                              filter: "grayscale(1)"
                            }}
                            src={defaultPublicationImg}
                          />
                        )}
                      </div>
                    )}
                    {!publication.deleteAt && (
                      <div>
                        {publication.publicationPic ? (
                          /* This is a trick to force the browser to reload the image as AWS uses the same URL for updated images. */
                          <Avatar
                            src={`${
                              publication.publicationPic
                            }?${new Date().getTime()}`}
                            sx={{ width: 96, height: 90 }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              bgcolor: "pink",
                              width: 96,
                              height: 90
                            }}
                            src={defaultPublicationImg}
                          />
                        )}
                      </div>
                    )}
                    <span
                      className={classes.publicationName}
                      onClick={() => {
                        navigate(
                          `/publication/${userUserName}/${publication.publicationName}`,
                          {
                            state: publication
                          }
                        );
                      }}
                    >
                      {publication.publicationName}
                    </span>
                  </Box>
                  {!publication.deleteAt && (
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
                  )}
                  {publication.deleteAt &&
                    convertIntoHoursAndMinutes(
                      publication.deleteAt - curDate
                    ) !== "Deleting Soon" && (
                      <button className="deleted-publication-button">
                        <div className="deleted-time-svg">
                          <svg
                            width="23"
                            height="29"
                            viewBox="0 0 23 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.6768 28.2451C17.787 28.2451 22.7402 23.2918 22.7402 17.1816C22.7402 11.0715 17.787 6.11816 11.6768 6.11816C5.56657 6.11816 0.613281 11.0715 0.613281 17.1816C0.613281 23.2918 5.56657 28.2451 11.6768 28.2451ZM11.6766 24.8288C15.9001 24.8288 19.3239 21.405 19.3239 17.1815C19.3239 12.958 15.9001 9.53418 11.6766 9.53418C7.45312 9.53418 4.0293 12.958 4.0293 17.1815C4.0293 21.405 7.45312 24.8288 11.6766 24.8288Z"
                              fill="white"
                            />
                            <path
                              d="M7.62891 2.47262C7.62891 1.52448 8.39752 0.755859 9.34566 0.755859H14.0063C14.9545 0.755859 15.7231 1.52448 15.7231 2.47262C15.7231 3.42075 14.9545 4.18937 14.0063 4.18937H9.34566C8.39752 4.18937 7.62891 3.42075 7.62891 2.47262Z"
                              fill="white"
                            />
                            <path
                              d="M1.88921 7.70942C2.59437 7.00426 3.73766 7.00426 4.44282 7.70942L5.38364 8.65024C6.0888 9.3554 6.0888 10.4987 5.38364 11.2039C4.67848 11.909 3.53519 11.909 2.83003 11.2039L1.88921 10.263C1.18405 9.55787 1.18405 8.41458 1.88921 7.70942Z"
                              fill="white"
                            />
                            <path
                              d="M10.9547 17.9019C10.5569 17.5041 10.5569 16.8592 10.9547 16.4613L14.2148 13.2012C14.6126 12.8034 15.2576 12.8034 15.6554 13.2012C16.0532 13.599 16.0532 14.244 15.6554 14.6418L12.3953 17.9019C11.9975 18.2997 11.3525 18.2998 10.9547 17.9019Z"
                              fill="white"
                            />
                            <path
                              d="M14.001 17.1812C14.001 18.4656 12.9597 19.5069 11.6753 19.5069C10.3909 19.5069 9.34961 18.4656 9.34961 17.1812C9.34961 15.8967 10.3909 14.8555 11.6753 14.8555C12.9597 14.8555 14.001 15.8967 14.001 17.1812Z"
                              fill="white"
                            />
                          </svg>
                          <div className="separator"></div>
                        </div>
                        <div className="button-text-wrapper">
                          <span className="deleted-button-text-span">
                            Deletion In
                          </span>
                          <span className="deleted-button-time-span">
                            {convertIntoHoursAndMinutes(
                              publication.deleteAt - curDate
                            )}
                          </span>

                          {/* convertIntoHoursAndMinutes(publication.deleteAt - curDate) !== "Deleting Soon" ?  */}
                        </div>
                      </button>
                    )}

                  {publication.deleteAt &&
                    convertIntoHoursAndMinutes(
                      publication.deleteAt - curDate
                    ) === "Deleting Soon" && (
                      <button className="deleting-soon-button">
                        <span className="deleting-soon-span">
                          Deleting Soon
                        </span>
                      </button>
                    )}
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
                      "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)"
                  }}
                  style={{
                    width: "15rem",
                    height: "38px"
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
    backgroundColor: "#F6F6F7"
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
    borderRadius: "20px"
  },

  publicationContainer2: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
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
    borderColor: "#0095FF"
    // borderRadius: '10px',
  },

  publicationPresentContainer: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "calc(100vh - 8rem)",
    backgroundColor: "#F6F6F7"
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
    borderRadius: "20px"
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
    outline: "none"
  },

  formContainer1: {
    backgroundColor: "white",
    margin: "auto",
    width: "28rem",
    height: "32rem",
    marginTop: "2rem",
    borderRadius: "28px",
    outline: "none"
  },

  connectedLine: {
    // width: "2px",
    // backgroundColor: "#2B56FF",
    borderLeft: "3px dashed #2B56FF",
    // height: "100px",
    height: "5rem"
  },

  publishButton: {
    height: "5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "25rem"
  },

  publicatonBtn: {
    // border: "1px solid rgba(151, 151, 151, 0.3)",
    border: " 2px solid #979797",
    boxSizing: "border-box",
    borderRadius: "10px",
    width: "180px",
    height: "47px",
    marginRight: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    cursor: "pointer"
  },

  publicationBox: {
    height: "5rem"
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
    color: "#636363"
  }
});

export default WriterPublication;
