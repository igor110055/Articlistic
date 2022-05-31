import { useState, useEffect } from "react";
import { ReactComponent as Logo } from "../../Images/logo.svg";
import { ReactComponent as GoogleLogo } from "../../Images/GoogleLogo.svg";
import { ReactComponent as EmailLogo } from "../../Images/VectorEmail.svg";
import Button from "./components/primary-button/button";
import EmailVerification from "./components/emailVerification/emailVerification";
import SetUpProfile from "./components/set-up-profile/set-up-profile";
import PickFavWriters from "./components/pick-fav-writers/pick-fav-writers";
// import TempNavbar from "../navbar/tempNavbar";
import OnboardingNavbar from "../navbar/onBoardingNavbar";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
// import left_img from "../../Images/background-left.svg";
// import right_img from "../../Images/background-right.svg";
import "./signup.css";
function SignUp() {
  const navigate = useNavigate();
  const [emailSignUp, setEmailSignUp] = useState(false);
  const [displayPage, setDisplayPage] = useState("");
  useEffect(() => {
    // console.log(emailSignUp);
  }, [emailSignUp]);

  const customStyle = {
    minWidth: "100%",
    width: "100%",
    height: "3rem",

    backgroundColor: "#fff",
    border: "2px solid #EFEFEF",
    borderRadius: "10px",
    outline: "none",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  useEffect(() => {
    const id = localStorage.getItem("createUserId");
    if (id) setDisplayPage("setUpProfile");
  }, []);

  const handleGoogleLogin = async (googleData) => {
    console.log(googleData);
    const res = await fetch("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
  };

  const handleGoogleFailure = (error) => {
    alert(JSON.stringify(error));
  };

  return (
    <div
    // style={{
    //   display: "flex",
    //   justifyContent: "space-between",
    //   alignItems: "center",
    //   overflow: "hidden",
    // }}
    >
      <div className="onboarding-navbar">
        <OnboardingNavbar />
      </div>
      {/* <img src={left_img} alt="left-img" className="signup-bubble_img" /> */}
      {displayPage === "" && (
        <div className="signup-container">
          <div className="get-started-section">
            <Logo className="attentioun-logo" />
            <h3 className="get-started-text">Get Started</h3>
            <p className="join-attentioun-text">Join Attentioun</p>
          </div>
          <div className="signup-buttons">
            {/* <Button
              text={"Sign up with Google"}
              isSvg
              Svg={GoogleLogo}
              callback={signUpWithGoogle}
            /> */}
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              // buttonText="Log in with Google"
              render={({ onClick }) => (
                <Button
                  text={"Sign up with Google"}
                  isSvg
                  Svg={GoogleLogo}
                  // callback={onClick}
                />
              )}
              onSuccess={handleGoogleLogin}
              onFailure={handleGoogleFailure}
              cookiePolicy={"single_host_origin"}
            />
            <Button
              text={"Sign up with email"}
              isSvg
              Svg={EmailLogo}
              callback={() => {
                setDisplayPage("EmailSignup");
                setEmailSignUp(true);
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
      )}
      {displayPage === "EmailSignup" && (
        <EmailVerification setDisplayPage={setDisplayPage} />
      )}

      {displayPage === "setUpProfile" && (
        <SetUpProfile setDisplayPage={setDisplayPage} />
      )}

      {displayPage === "pickFavouriteWriters" && <PickFavWriters />}
      {/* <img src={right_img} alt="left-img" className="signup-bubble_img" /> */}
    </div>
  );
}

export default SignUp;
