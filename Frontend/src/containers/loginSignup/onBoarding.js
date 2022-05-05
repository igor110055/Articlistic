import "./onBoarding.css";
// import backgroundSVG from "./../../Images/background.svg";
import CreateProfile from "./createProfile";
import OnBoardingTrack from "./onBoardinTrack";
import { useEffect, useState } from "react";
import MobileVerification from "./mobileVerification";
import EmailVerification from "./emailVerification";

import left_img from "../../Images/background-left.svg";
import WritersAndCategories from "../writersAndCategories/writersAndCategories";

import rocket from "../../Images/rocket.png";
import { useSelector, useDispatch } from "react-redux";
import {
  userEmail,
  userPassword,
  userPhone,
  userPName,
  userUsername
} from "../user/userActions";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
const OnBoarding = () => {
  const [displayPage, setDisplayPage] = useState("mobileVerification");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector(state => ({
    user: state.user
  }));

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch(
        userUsername(JSON.parse(localStorage.getItem("user"))?.userUserName)
      );
      dispatch(
        userPassword(
          JSON.parse(localStorage.getItem("user"))?.userAccountPassword
        )
      );
      dispatch(
        userPName(JSON.parse(localStorage.getItem("user"))?.userProfileName)
      );
      dispatch(
        userEmail(JSON.parse(localStorage.getItem("user"))?.userEmailID)
      );
      dispatch(
        userPhone(JSON.parse(localStorage.getItem("user"))?.userPhoneNumber)
      );
    }
  }, [displayPage]);

  useEffect(() => {
    if (localStorage.getItem("displayPage") !== undefined) {
      setDisplayPage(localStorage.getItem("displayPage"));
    } else if (localStorage.getItem("displayPage") === null) {
      localStorage.setItem("displayPage", "mobileVerification");
      setDisplayPage("mobileVerification");
    }

    if (Cookie.get("accessToken")) {
      navigate("/writerDashboard");
    }
  }, []);
  useEffect(() => {
    if (displayPage === "null") {
      localStorage.setItem("displayPage", "mobileVerification");
      setDisplayPage(displayPage);
    } else {
      localStorage.setItem("displayPage", displayPage);
    }
  }, [displayPage]);
  return (
    <div className="onboarding-major-div">
      <div className="alpha-tester">
        <div className="alpha-tester-div">
          <div className="alpha-tester-name">
            <span>Alpha Adopter's Release &nbsp;</span>
            <img src={rocket} alt="rocket"></img>
          </div>
        </div>
      </div>
      <div>
        <OnBoardingTrack displayPage={displayPage} />
      </div>

      <div className="onboarding-signup">
        {displayPage !== "mapWritersAndCategories" && (
          <div className="onboarding-screen">
            <div className="onboarding-left-img">
              <img src={left_img} className="bg-img-left" alt="left_img"></img>
            </div>
            {displayPage === "mobileVerification" && (
              <MobileVerification
                className="onboarding-internal"
                displayPage={displayPage}
                setDisplayPage={setDisplayPage}
              />
            )}
            {displayPage === "emailVerification" && (
              <EmailVerification
                className="onboarding-internal"
                displayPage={displayPage}
                setDisplayPage={setDisplayPage}
              />
            )}
            {displayPage === "createProfile" && (
              <CreateProfile
                // className="onboarding-internal"
                displayPage={displayPage}
                className="onboarding-internal"
                setDisplayPage={setDisplayPage}
              />
            )}
            <div className="right-img">
              <div className="random-div">
                <img
                  src={left_img}
                  className="bg-img-right"
                  alt="left_img"
                ></img>
              </div>
            </div>
          </div>
        )}
        {displayPage === "mapWritersAndCategories" && (
          <WritersAndCategories className="onboarding-internal" />
        )}
      </div>
    </div>
  );
};

export default OnBoarding;
