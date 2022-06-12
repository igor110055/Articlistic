import Linkedin from "../../../Images/socials/linkedin.svg";
import Twitter from "../../../Images/socials/twitter.svg";
import Website from "../../../Images/socials/website.svg";
import { makeStyles } from "@mui/styles";
import "./user-panel.css";
import { useState } from "react";

import { Modal, Box } from "@material-ui/core";
import AlexTanario from "../../../Images/users/AlexTenario.png";
const UserPanel = () => {
  const classes = useStyles();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [openfavoritemodal, setopenfavoritesmodal] = useState(false);
  const [followingmodal, setfollowingmodal] = useState("follow");
  const [blockmodal, setblock] = useState(false);
  const userslist = [
    {
      name: "Jason peter ross",
      img: AlexTanario,
    },
    {
      name: "Jason peter ross",
      img: AlexTanario,
    },
    {
      name: "Jason peter ross",
      img: AlexTanario,
    },
    {
      name: "Jason peter ross",
      img: AlexTanario,
    },
  ];
  const handleOpenImport = () => {
    setImportModalOpen(true);
  };
  return (
    <div className="user-row">
      <div className="user-info">
        <div className="user-info-bar">
          <div className="user-info-img">
            <img
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
              alt="user"
            />
            <div className="buttons-follow">
              <button
                className="follow"
                onClick={() => {
                  setfollowingmodal(true);
                }}
              >
                Follow
              </button>
              <button className="message">Message</button>
              <button
                className="moreinfo"
                onClick={() => {
                  setopenfavoritesmodal((prev) => !prev);
                }}
              >
                ...
              </button>
            </div>
            {openfavoritemodal && (
              <div className="open-favorites">
                <p className="favorites-btn">Add to Favorites</p>
                <p className="share-profile-btn">Share Profile</p>
                <p className="block-btn" onClick={() => setblock(true)}>
                  Block
                </p>
                <p className="report-btn">Report</p>
              </div>
            )}
          </div>
          <div className="user-info-name">
            <h3>Yash Chaudhari</h3>
            <div className="funders-username">
              <p className="username">@ts.rex</p>{" "}
              <button className="top-funders">
                Top Funders <span>23</span>
              </button>
              <button className="first-funder">
                First Funder<span>45</span>
              </button>
            </div>
            <div className="followers-all">
              <p>67 Stories Funded</p>
              <p>608 Following</p>
              <p>756 Followers</p>
            </div>
            <p className="discription">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio
              corrupti, dolores provident itaque fuga officiis voluptates vero
              minus tenetur illum facilis magnam, sapiente repellat autem
              tempore qui dolorem dignissimos vel, odit unde asperiores
              deleniti!
            </p>
            <p className="join-date">March, 2021</p>
            <div className="socials">
              <div className="social-links">
                <img src={Linkedin} />
                <img src={Twitter} />
                <div className="website">
                  <img src={Website} alt="" />
                  <p>tusharsinghkshatriya.com</p>
                </div>
              </div>
              <p className="writer-para">Writer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="users-followers-info-bar">
        <div className="followers-nav">
          <p>Writes</p>
          <p>Reads</p>
        </div>
        <hr />
        <div className="followers-list">
          {userslist.map((data) => (
            <div className="followers-list-item">
              <img src={data.img} />
              <p>{data.name}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={blockmodal}
        onClose={() => {
          setblock(false);
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer1}>
          <div className={classes.importForm}>
            <div className={classes.profile}>
              <img
                className={classes.img}
                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
              />
              <h5>Block @tsk.rex ?</h5>
              <p>
                They won't be able to find your profile or interact with you on
                Attentioun.
              </p>
            </div>
            <div className={classes.btns}>
              <button className={classes.block}>Block</button>
              <button className={classes.cancel}>Cancel</button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const useStyles = makeStyles({
  img: {
    width: "140.98px",
    height: "138px",
    border: "10px solid white",
    borderRadius: "50%",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  btns: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
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
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

export default UserPanel;
