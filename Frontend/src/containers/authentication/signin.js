import { useState } from "react";
import { ReactComponent as Logo } from "../../Images/logo.svg";
import { ReactComponent as GoogleLogo } from "../../Images/GoogleLogo.svg";
import Button from "./components/primary-button/button";
import { ReactComponent as ErrorSvg } from "../../Images/VectorErrorAlert.svg";
import ForgotPassword from "./components/forgot-password/forgot-password";
import { validateEmail } from "../../utils/common";

import Input from "./components/primary-input/input";
import "./signin.css";
function SignIn() {
  const [validEmail, setValidEmail] = useState(true);
  const [email, setEmail] = useState("");
  const [displayPage, setDisplayPage] = useState("sign-in");
  const signInWithGoogle = () => {};
  const gotoForgot = () => {
    setDisplayPage("forgot-password");
  };
  const handleSignIn = () => {
    if (validateEmail(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };
  return (
    <div>
      {displayPage === "sign-in" && (
        <div className="sign-in-container">
          <div className="sign-in-section">
            <Logo className="attentioun-logo" />
            <p className="sign-in-text">Sign in to</p>
            <h3 className="attentioun-header">Attentioun</h3>
          </div>
          <div className="sign-in-buttons">
            <Button
              text={"Sign in with Google"}
              isSvg
              Svg={GoogleLogo}
              callback={signInWithGoogle}
            />
            <p className="or-div"> &nbsp; OR &nbsp; &nbsp;</p>
            <div className="email-sign-in">
              {!validEmail && (
                <p className="wrong-email">
                  <div className="error-svg">
                    <ErrorSvg />{" "}
                  </div>
                  <span>
                    We couldn’t find an account matching the username and
                    password you entered.
                  </span>
                </p>
              )}
              {/* <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input type="password" placeholder="Password" /> */}
              <Input
                type={"email"}
                placeholder={"Email"}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input type="password" placeholder="Password" />
              <Button text="Sign In" blue callback={handleSignIn} />
              <p className="forgot-password" onClick={gotoForgot}>
                Forgot Password?
              </p>
            </div>
          </div>
          <p className="sign-up">
            Don't have an account yet? <span>Sign up</span>
          </p>
        </div>
      )}

      {displayPage === "forgot-password" && (
        <ForgotPassword setDisplayPage={setDisplayPage} />
      )}
    </div>
  );
}

export default SignIn;
