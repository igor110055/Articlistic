import { useState, useEffect } from "react";
import { ReactComponent as Logo } from "../../Images/logo.svg";
import { ReactComponent as EmailLogo } from "../../Images/VectorEmail.svg";
import Button from "./components/primary-button/button";
import EmailVerification from "./components/emailVerification/emailVerification";
import SetUpProfile from "./components/set-up-profile/set-up-profile";
import PickFavWriters from "./components/pick-fav-writers/pick-fav-writers";
import { useSelector } from "react-redux";
import OnboardingNavbar from "../navbar/onBoardingNavbar";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "./components/google-auth/googleAuth";
import Cookie from "js-cookie";
import left_img from "../../Images/background-left.svg";
import right_img from "../../Images/background-right.svg";
import "./signup.css";
function SignUp() {
  const { googleSignInSuccess } = useSelector((state) => ({
    googleSignInSuccess: state.signupReducer.googleSignInSuccess,
  }));
  const navigate = useNavigate();
  const [displayPage, setDisplayPage] = useState("");

  useEffect(() => {
    if (googleSignInSuccess) navigate("/writerDashboard");
  }, [googleSignInSuccess]);

  useEffect(() => {
    const id = localStorage.getItem("createUserId");
    if (id) setDisplayPage("setUpProfile");
  }, []);

  useEffect(() => {
    if (Cookie.get("accessToken")) navigate("/writerDashboard");
  }, []);

  return (
    <div>
      <div className="onboarding-navbar">
        <OnboardingNavbar />
      </div>
      <div>
        {displayPage === "" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div className="bubble_background_container">
              <img
                src={left_img}
                className="onboarding-bubble-image"
                alt="left-img"
              />
            </div>
            <div className="signup-container">
              <div className="get-started-section">
                <Logo className="attentioun-logo" />
                <h3 className="get-started-text">Get Started</h3>
                <p className="join-attentioun-text">Join Attentioun</p>
              </div>
              <div className="signup-buttons">
                <GoogleAuth setDisplayPage={setDisplayPage} />

                <Button
                  text={"Sign up with email"}
                  isSvg
                  Svg={EmailLogo}
                  callback={() => {
                    setDisplayPage("EmailSignup");
                  }}
                />
              </div>
              <div className="already-have-account-section">
                Already have an account?{" "}
                <span className="sign-in" onClick={() => navigate("/login")}>
                  Sign in
                </span>
              </div>
            </div>
            <div className="bubble_background_container">
              <img
                src={right_img}
                className="onboarding-bubble-image"
                alt="left-img"
              />
            </div>
          </div>
        )}
        {displayPage === "EmailSignup" && (
          <EmailVerification setDisplayPage={setDisplayPage} />
        )}

        {displayPage === "setUpProfile" && (
          <SetUpProfile setDisplayPage={setDisplayPage} />
        )}

        {displayPage === "pickFavouriteWriters" && <PickFavWriters />}
      </div>
    </div>
  );
}

export default SignUp;
