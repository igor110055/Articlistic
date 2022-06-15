import Linkedin from "../../../Images/socials/linkedin.svg";
import Twitter from "../../../Images/socials/twitter.svg";
import Website from "../../../Images/socials/website.svg";
import { makeStyles } from "@mui/styles";
import "./user-panel.css";
import { useState } from "react";

import { Modal, Box } from "@material-ui/core";
import AlexTanario from "../../../Images/users/AlexTenario.png";
import { useSelector } from "react-redux";
const UserPanel = () => {
    const data=useSelector(state=>state.profile)
   console.log(data);
  const classes = useStyles();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [openfavoritemodal, setopenfavoritesmodal] = useState(false);
  const [followermodal, setfollowermodal] = useState("");
  const [blockmodal, setblock] = useState(false);
  const [unfollow,setunfollow]=useState(false)
  const [clickedclass,setclickedclass]=useState("Writes")
  const [unfollowmodal,setunfollowmodal]=useState(false)
  
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
  return (
    <div className="user-row">
      <div className="user-info">
        <div className="user-info-bar">
          <div className="user-info-img">
            <img
              src={data.profilePic===undefined?"https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60":data.profilePic}
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

              <button
                className={`${unfollow?'message':'follow'}`}
                onClick={() => {
                    if(unfollow){
                        setunfollowmodal(true);
                        return;
                    }
                setunfollow(true)
                }}
              >
               {unfollow?'Following':'Follow'}
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
            <h3>{data.name}</h3>
            <div className="funders-username">
              <p className="username">@{`${!data.username||data.username.length==0?'xyz':data.username}`}</p>{" "}
              <div className="funders-sec">
              <button className="top-funders">
                Top Funders <span>23</span>
              </button>
              <button className="first-funder">
                First Funder<span>45</span>
              </button>
              </div>
              <div className="buttons-follow-resp">

              <button
                className={`${unfollow?'message':'follow'}`}
                onClick={() => {
                setunfollow(true)
                }}
              >
               {unfollow?'Following':'Follow'}
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
            </div>
            <div className="followers-all">
              <p>67 Stories Funded</p>
              <p onClick={()=>{setfollowermodal('following')}}>{data.following==undefined?23:data.following} Following</p>
              <p onClick={()=>{setfollowermodal('follow')}}>{data.follower==undefined?45:data.follower} Followers</p>
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
                  <p>xyz.com</p>
                </div>
              </div>
              {data.isWriter &&  <p className="writer-para">Writer</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="users-followers-info-bar">
          <div className="user-stories-nav">
      {headdata.map((data, idx) => (
          <div onClick={()=>{setclickedclass(data)}} className={`user-stories-nav-items ${clickedclass==data?'active-stories-class':''}`}>
            <p>{data}</p>
            {clickedclass===data && (
                <div className="blue-line-container"></div>
            )}
          </div>
        ))}</div>
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
        open={followermodal}
        onClose={() => {
          setfollowermodal(false);
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer1}>
          <div className={classes.importForm1}>
            <div className={classes.navbar}>
            {userslist.map((data) => (
            <div className="followers-list-item">
              <div className={classes.navitems}>
              <img src={data.img} />
              <p>{data.name}</p>
              </div>
              <button className={classes.btn}>{followermodal==='follow'? 'Follow':'Following'}</button>
            </div>
          ))}
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
        <Box className={classes.formContainer1}>
          <div className={classes.importForm}>
            <div className={classes.profile}>
              <img className={classes.img} src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
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

      <Modal
        open={unfollowmodal}
        onClose={() => {
          setunfollowmodal(false);
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box className={classes.formContainer1}>
          <div className={classes.importForm}>
            <div className={classes.profile}>
              <img className={classes.img} src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
              
            </div>
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
    block:{

fontWeight: "600",
color: "#EB4335",    backgroundColor: "white",
border: "1px solid white",
    },
    cancel:{
fontWeight: "600",
fontSize: "15px",
lineHeight: "22px",


color: "#000000",

        backgroundColor: "white",
        border: "1px solid white",
    }
    ,
    hr:{
        backgroundColor:'black',
        height:"1px",
        width:'100%',
    },
    importForm1:{
        display: "flex",
        position: "relative",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        top: "2rem"
    },
    btn:{
        border:" 2px solid #CFCFCF",
        borderRadius:" 6px",
        backgroundColor: "white",
        padding: "5px 10px"
    },
    img:{
        width: "140.98px",
        height: "138px",
        border: "10px solid white",
        borderRadius: "50%"
    },
    navitems:{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "60%"
    },
    navbar:{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        // verflow: "hidden"
        width:"100%",
        overflow:'hidden'
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
});

export default UserPanel;
