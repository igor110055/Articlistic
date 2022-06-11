import "./tempNavbar.css";
import hlogo from "./../../Images/horizontal (1).svg";
import userImage from "./../../Images/user-image.png";
import { useEffect, useState } from "react";
import { logout } from "../authentication/signupActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { getAuthToken } from "../common/commonFunctions";

const TempNavbar = () => {
  const [isResponsive, setIsResponsive] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const isWriter = localStorage.getItem("isWriter");
  function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
      x.style.flexDirection = "column";
      x.style.alignItems = "flex-start";
      document.getElementById("login").className = "right-content";
      setIsResponsive(true);
    } else {
      document.getElementById("login").className = "right-content nav-login";
      x.className = "topnav";
      x.style.flexDirection = "row";
      x.style.alignItems = "center";
      setIsResponsive(false);
    }
  }

  const refreshPage = () => {
    navigate("/homepage");
  };

  useEffect(() => {
    const ele = document.querySelector(".dropdown-content");
    if (!submitClicked) {
      if (openSignup) {
        ele.style = "display: block;";
      } else {
        ele.style = "display: none;";
      }
    }
  }, [openSignup]);

  const [submitClicked, setSubmitClicked] = useState(false);

  const { isLoggingOut, logoutError } = useSelector((state) => ({
    state: state,
    isLoggingOut: state.signupReducer.isLoggingOut,
    logoutError: state.signupReducer.logoutError,
    logoutSuccess: state.signupReducer.logoutSuccess,
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (logoutError) {
      setSubmitClicked(false);
    } else {
      if (!isLoggingOut && submitClicked) {
        Cookie.remove("oneDayBeforeAccessToken");
        Cookie.remove("accessToken");
        Cookie.remove("refreshToken");
        localStorage.removeItem("user");
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [isLoggingOut]);

  const handleSignout = () => {
    const temp = getAuthToken();
    dispatch(
      logout(
        {
          accessToken: temp,
          username: JSON.parse(localStorage.getItem("user")).userUserName,
        },
        temp
      )
    );
    setSubmitClicked(true);
  };
  return (
    <div className="topnav" id="myTopnav">
      <a>
        <div className="nav-left">
          <div
            className="nav-logo"
            style={{ cursor: "pointer" }}
            onClick={refreshPage}
          >
            <img src={hlogo} alt="logo" className="nav-logo" />
          </div>
          {/* <div className="nav-search">
                        <img src={searchLogo} alt="search" />
                        <input type="text" placeholder="Search" />
                    </div> */}
        </div>
      </a>
      <div className="nav-right">
        {isWriter === "true" && (
          <span
            onClick={() => navigate("/writerDashboard")}
            className="right-first right-content"
          >
            Writer-Dashboard
          </span>
        )}
        <span
          onClick={() => navigate("/wallet")}
          className="right-first right-content"
        >
          Wallet
        </span>
        {/* <a href="#profile" className="right-content">Profile</a> */}
        {/* <a className="dropdown"> */}
        {/* <a href="#profile" className="right-content">Profile</a> */}
        {/* <div className="dropdown-content">
                        <a href="/writerDashboard">Writer Dashboard</a>
                        <a href="#">Link 2</a>
                        <a href="#">Link 3</a>
                    </div> */}
        {/* </a> */}
        {/* <a href="#bookmark" className="right-content">
                    {!isResponsive ? (<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="19.5" cy="19.5" r="19" fill="white" stroke="#CECECE" />
                        <path d="M14 13.5H25" stroke="#3095FF" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M25 29L19.1765 25.069L14 29V10H25V29Z" stroke="#2B406E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>) : <div>
                        Bookmarks</div>}
                </a> */}
        {/* <a href="#notifications" className="right-content">
                    {!isResponsive ? (<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="19.5" cy="19.5" r="19" fill="white" stroke="#CECECE" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M26 25H13L15.1014 15.9489C15.4983 14.2387 17.3466 13 19.5 13C21.6534 13 23.5017 14.2387 23.8986 15.9489L26 25Z" stroke="#2B406E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> */}
        {/* <mask id="mask0_360_4757" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="17" y="26" width="5" height="3">
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.332 26.7227H21.6685V28.9995H17.332V26.7227Z" fill="white" />
                        </mask> */}
        {/* <g mask="url(#mask0_360_4757)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.6685 26.7227C21.6685 27.9804 20.6977 28.9997 19.4999 28.9997C18.3027 28.9997 17.332 27.9804 17.332 26.7227H21.6685Z" fill="#3295FF" />
                        </g>
                        <path d="M19.5 13V11" stroke="#2B406E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>) : <div>
                        Notifications</div>}
                </a> */}
        {/* <a href="#login" id="login" className="right-content nav-login">Login</a> */}
        <a
          id="login"
          className="right-content dropdown"
          onClick={() =>
            openSignup ? setOpenSignup(false) : setOpenSignup(true)
          }
        >
          <img src={userImage} className="nav-logged-in dropbtn" />
          {!isLoggingOut && (
            <div className="dropdown-content">
              <span onClick={handleSignout} style={{ cursor: "pointer" }}>
                Signout
              </span>
            </div>
          )}
        </a>
        <a className="icon right-content" onClick={() => myFunction()}>
          <svg
            height="24px"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 32 32"
            width="32px"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TempNavbar;
