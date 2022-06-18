import Linkedin from "../../../Images/socials/linkedin.svg";
import Twitter from "../../../Images/socials/twitter.svg";
import Website from "../../../Images/socials/website.svg";
import { makeStyles } from "@mui/styles";
import "./user-panel.css";
import { useState } from "react";
import profilepic from "../../../Images/user-profile.jfif";
import { Modal, Box } from "@material-ui/core";
import AlexTanario from "../../../Images/users/AlexTenario.png";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
const UserPanel = () => {
  const data = useSelector((state) => state.profile);
  console.log("data-panel", data);
  const classes = useStyles();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [openfavoritemodal, setopenfavoritesmodal] = useState(false);
  const [followermodal, setfollowermodal] = useState("");
  const [blockmodal, setblock] = useState(false);
  const [unfollow, setunfollow] = useState(false);
  const [clickedclass, setclickedclass] = useState("Writes");
  const [followclickedclass, setfollowclickedclass] = useState("Followers");
  const [unfollowmodal, setunfollowmodal] = useState(false);
  const stateparams = useParams();
  const state = localStorage.getItem("user");
  const user = JSON.parse(state);
  const headdata = ["Writes", "Read"];
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
  const followerdata = ["Followers", "Following"];
  return (
    <div className="user-row">
      <div className="user-info">
        <div className="user-info-bar">
          <div className="user-info-img">
            <img
              src={
                //   data.profilePic===undefined||data.profilePic.length==0?
                profilepic
                // :data.profilePic
              }
              alt="user"
            />
            <div className="funders-sec-resp">
              <button className="top-funders">
                Top Funders <span>23</span>
              </button>
              <button className="first-funder">
                First Funder<span>45</span>
              </button>
            </div>
            <div className="buttons-follow">
              {stateparams.username == user.userUserName ? (
                <button className="message">Edit Profile</button>
              ) : (
                <>
                  <button
                    className={`${unfollow ? "message" : "follow"}`}
                    onClick={() => {
                      if (unfollow) {
                        setunfollowmodal(true);
                        return;
                      }
                      setunfollow(true);
                    }}
                  >
                    {unfollow ? "Following" : "Follow"}
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
                </>
              )}
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
            <h3>{data.name}</h3>
            <div className="funders-username">
              <p className="username">
                @
                {`${
                  !data.username || data.username.length == 0
                    ? "xyz"
                    : data.username
                }`}
              </p>{" "}
              <div className="funders-sec">
                <button className="top-funders">
                  Top Funders <span>23</span>
                </button>
                <button className="first-funder">
                  First Funder<span>45</span>
                </button>
              </div>
              <div className="buttons-follow-resp">
                {stateparams.username == user.userUserName ? (
                  <button className="message">Edit Profile</button>
                ) : (
                  <>
                    <button
                      className={`${unfollow ? "message" : "follow"}`}
                      onClick={() => {
                        setunfollow(true);
                      }}
                    >
                      {unfollow ? "Following" : "Follow"}
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
                  </>
                )}
              </div>
            </div>
            <div className="followers-all">
              <p>0 Stories Funded</p>
              <p
                onClick={() => {
                  setfollowermodal("Following");
                }}
              >
                {!data.following ? 0 : data.following.length} Following
              </p>
              <p
                onClick={() => {
                  setfollowermodal("Followers");
                }}
              >
                {!data.followers ? 0 : data.followers.length} Followers
              </p>
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
                  <p>xfhfdhdhhfg.com</p>
                </div>
              </div>
              {data.isWriter && <p className="writer-para">Writer</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="users-followers-info-bar">
        <div className="user-stories-nav">
          {headdata.map((data, idx) => (
            <div
              onClick={() => {
                setclickedclass(data);
              }}
              className={`user-stories-nav-items ${
                clickedclass == data ? "active-stories-class" : ""
              }`}
            >
              <p>{data}</p>
              {clickedclass === data && (
                <div className="blue-line-container"></div>
              )}
            </div>
          ))}
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
      {/* <div className="writes-bar">
        <div className="user-stories-nav">
          <div
            onClick={() => {
              setclickedclass("");
            }}
            className={`user-stories-nav-items ${"active-stories-class"}`}
          >
            <p>Writes</p>

            <div className="blue-line-container"></div>
          </div>
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
      <div className="reads-bar">
        <div className="user-stories-nav">
          <div
            onClick={() => {
              setclickedclass("");
            }}
            className={`user-stories-nav-items ${"active-stories-class"}`}
          >
            <p>Reads</p>

            <div className="blue-line-container"></div>
          </div>
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
      </div> */}
      <Modal
        open={followermodal.length != 0}
        onClose={() => {
          setfollowermodal("");
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer1}>
          <div className={classes.importForm1}>
            <div className={classes.navbar}>
              <div className="user-stories-nav">
                {followerdata.map((data, idx) => (
                  <div
                    onClick={() => {
                      setfollowermodal(data);
                    }}
                    className={`user-stories-nav-items ${
                      followermodal == data ? "active-stories-class" : ""
                    }`}
                  >
                    <p>{data}</p>
                    {followermodal === data && (
                      <div className="blue-line-container"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className={classes.userlist}>
                {data[followermodal.toLowerCase()] &&
                  data[followermodal.toLowerCase()].slice(0, 4).map((data) => (
                    <div className="followers-list-item">
                      <div className={classes.navitems}>
                        <img src={data.img} />
                       
                        <div>
                          {" "}
                          <p>{data.name}</p>
                          
                        </div>
                        {!data.isfollowing && <p className={classes.isfollowing}>Follow</p>}
                      </div>
                      <button className={classes.btn}>
                        {followermodal === "follow" ? "Unfollow" : "Remove"}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={blockmodal}
        onClose={() => {
          setblock(false);
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer3}>
          <div className={classes.importForm}>
            <div style={{width:"87%"}} className={classes.profile}>
              <img
                className={classes.img}
                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
              />
              <h5 className={classes.h5}>Block @tsk.rex ?</h5>
              <p className={classes.p}>
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

      <Modal
        open={unfollowmodal}
        onClose={() => {
          setunfollowmodal(false);
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer2}>
          <div className={classes.importForm}>
            <div className={classes.profile}>
              <img
                className={classes.img}
                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
              />
            </div>
            <h3>Unfollow @ts.rex?</h3>
            <div className={classes.hr}></div>
            <div className={classes.btns}>
              <button className={classes.block}>Unfollow</button>
              <div className={classes.vr}></div>
              <button className={classes.cancel}>Cancel</button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const useStyles = makeStyles({
  block: {
    fontWeight: "600",
    color: "#EB4335",
    backgroundColor: "white",
    border: "1px solid white",
  },
  userlist: {
    marginTop: "12px",
    width: "100%",
  },
  isfollowing:{
    fontFamily: 'Poppins',
fontStyle: "normal",
fontWeight: 600,
fontSize: "13px",
lineHeight: "34px",
/* identical to box height, or 189% */


color: "#1395FD",

  },
  cancel: {
    fontWeight: "600",
    fontSize: "15px",
    lineHeight: "22px",

    color: "#000000",

    backgroundColor: "white",
    border: "1px solid white",
  },
  hr: {
    backgroundColor: "black",
    height: "1px",
    width: "100%",
  },
  h5: {
    margin: "6px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontweight: 400,
    fontSize: "20px",
    lineHeight: "30px",
    /* identical to box height */

    letterSpacing: "-0.0583333px",

    color: "#000000",
  },
  p: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "22px",
    textAlign: "center",
    letterSpacing: "-0.0583333px",

    color: "#000000",
  },
  importForm1: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  btn: {
    fontFamily: 'Poppins',
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "15px",
    lineHeight: "22px",
    /* identical to box height */
    border: "2px solid #CFCFCF",
    borderRadius: "10px",
    padding: "4px 9px",
    background:"white",
    textAlign: "center",
    letterSpacing: "-0.0583333px",
    
    color: "#000000"
  },
  img: {
    width: "36%",
    border: "6px solid red",
    height: "17vh",
    borderRadius: "50%",
    margin: "15px 0",
  },
  navitems: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "45%",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    // verflow: "hidden"
    width: "100%",
    overflow: "hidden",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width:"100%",
    justifyContent: "center",
  },
  btns: {
    display: "flex",
    width: "100%",
    marginTop: "15px",

    alignItems: "center",
    justifyContent: "space-between",
  },
  formContainer2: {
    backgroundColor: "white",
    margin: "auto",
    width: "26rem",
    height: "18rem",
    marginTop: "10rem",
    borderRadius: "20px",
    outline: "none",
  },
  formContainer3: {
    backgroundColor: "white",
    margin: "auto",
    width: "32rem",
    height: "21rem",
    marginTop: "10rem",
    borderRadius: "20px",
    outline: "none",
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
    height: "75%",
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
  block: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: "22px",
    /* identical to box height */

    textAlign: "center",
    letterSpacing: "-0.0583333px",
    border: "1px solid white",
    backgroundColor: "white",
    color: "#EB4335",
  },
  cancel: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "15px",
    lineHeight: "22px",
    /* identical to box height */
    border: "1px solid white",
    backgroundColor: "white",
    letterSpacing: "-0.0583333px",

    color: "#000000",
  },
});

export default UserPanel;
