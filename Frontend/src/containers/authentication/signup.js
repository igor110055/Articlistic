import { useState, useEffect } from "react";
import { ReactComponent as Logo } from "../../Images/logo.svg";
import { ReactComponent as GoogleLogo } from "../../Images/GoogleLogo.svg";
import { ReactComponent as EmailLogo } from "../../Images/VectorEmail.svg";
import Button from "./components/primary-button/button";
import EmailVerification from "./components/emailVerification/emailVerification";
import SetUpProfile from "./components/set-up-profile/set-up-profile";
import PickFavWriters from "./components/pick-fav-writers/pick-fav-writers";
import "./signup.css";
function SignUp() {
  const [emailSignUp, setEmailSignUp] = useState(false);
  const [displayPage, setDisplayPage] = useState("");
  useEffect(() => {
    console.log(emailSignUp);
  }, [emailSignUp]);

  const signUpWithGoogle = () => {
    return;
  };

  return (
    <div>
      {displayPage === "" && (
        <div className="signup-container">
          <div className="get-started-section">
            <Logo className="attentioun-logo" />
            <h3 className="get-started-text">Get Started</h3>
            <p className="join-attentioun-text">Join Attentioun</p>
          </div>
          <div className="signup-buttons">
            <Button
              text={"Sign up with Google"}
              isSvg
              Svg={GoogleLogo}
              callback={signUpWithGoogle}
            />
            <Button
              text={"Sign up with email"}
              isSvg
              Svg={EmailLogo}
              callback={() => setDisplayPage("EmailSignup")}
            />
          </div>
          <div className="already-have-account-section">
            Already have an account? <span className="sign-in">Sign in</span>
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
  );
}

export default SignUp;
