import "./landingPage.css";
import LoginSignupLanding from "./loginSignupLanding";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Cookie from "js-cookie";
import left_img from "../../Images/background-left.svg";

import rocket from "../../Images/rocket.png";
const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      Cookie.get("accessToken") &&
      localStorage.getItem("categories") !== null &&
      localStorage.getItem("categories") !== undefined
    ) {
      navigate("/writerDashboard"); //for writers
    } else if (
      Cookie.get("accessToken") &&
      (localStorage.getItem("categories") === null ||
        localStorage.getItem("categories") === undefined)
    ) {
      navigate("/writerDashboard"); //signup for writers
    }
  }, []);
  return (
    <div className="major-div">
      <div className="alpha-tester-login">
        <div className="alpha-tester-div">
          <div className="alpha-tester-name">
            <span>Alpha Adopter's Release &nbsp;</span>
            <img src={rocket} alt="rocket"></img>
          </div>
        </div>
      </div>
      <div className="main-div">
        <div className="left-img">
          <img src={left_img} className="bg-img-left" alt = "rocket"></img>
        </div>
        <div className="onboarding">
          <LoginSignupLanding />
        </div>

        <div className="right-img">
          <div className="random-div">
            <img src={left_img} className="bg-img-right" alt = "rocket"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
