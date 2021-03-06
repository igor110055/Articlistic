import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../../Images/logo.svg";
import BackgroundRight from "../../Images/background-right.svg";
import BackgorundLeft from "../../Images/background-left.svg";
import Button from "./components/primary-button/button";
import ForgotPassword from "./components/forgot-password/forgot-password";
import { validateEmail, validatePassword } from "../../utils/common";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, resetPasswordState } from "./signupActions";
import Input from "./components/primary-input/input";
import PrimaryError from "./components/primary-error/primaryError";
import { userEmail, userUsername, userPName } from "../user/userActions";
import VerifyOTP from "./components/forgot-password/verifyOTP";
import "./signin.css";
import OnboardingNavbar from "../navbar/onBoardingNavbar";
import GoogleAuth from "./components/google-auth/googleAuth";
import SetNewPassword from "./components/forgot-password/setNewPassword";
import Cookie from "js-cookie";

function SignIn() {
  const { isSendingLoginCred, loginError, isLoggedIn, loginResp } = useSelector(
    (state) => ({
      isSendingLoginCred: state.signupReducer.isSendingLoginCred,
      loginError: state.signupReducer.loginError,
      loginErrorMsg: state.signupReducer.loginErrorMsg,
      isLoggedIn: state.signupReducer.isLoggedIn,
      loginResp: state.signupReducer.loginResp,
      user: state.user,
    })
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validCred, setValidCred] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("username");
  const [displayPage, setDisplayPage] = useState("sign-in");
  const gotoForgot = () => {
    dispatch(resetPasswordState());
    setDisplayPage("forgot-password");
  };
  const handleSignIn = () => {
    if (validateEmail(email)) setType("email");
    else setType("username");

    if (!validatePassword(password) && email !== "") {
      setValidCred(false);
      return;
    }
    dispatch(login({ entity: email, type: type, password }));
  };

  useEffect(() => {
    const accessToken = Cookie.get("accessToken");
    if (accessToken) navigate("/homepage");
  });

  useEffect(() => {
    if (!loginError && isLoggedIn) {
      setValidCred(true);
      dispatch(userEmail(loginResp.private.email));
      dispatch(userPName(loginResp.name));
      dispatch(userUsername(loginResp.username));
      localStorage.setItem(
        "user",
        JSON.stringify({
          userEmailID: loginResp.private.email,
          userProfileName: loginResp.name,
          userUserName: loginResp.username,
        })
      );

      navigate("/homepage");
    } else if (loginError) setValidCred(false);
  }, [loginError, isLoggedIn]);

  useEffect(() => {
    setValidCred(true);
  }, [displayPage]);

  return (
    <div>
      <div className="signin-navbar">
        <OnboardingNavbar />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bubble_background_container">
          <img
            src={BackgorundLeft}
            alt="left-background"
            className="onboarding-bubble-image"
          />
        </div>
        {displayPage === "sign-in" && (
          <div className="sign-in-container">
            <div className="sign-in-section">
              <Logo className="attentioun-logo" />
              <p className="sign-in-text">Sign in to</p>
              <h3 className="attentioun-header">Attentioun</h3>
            </div>
            <div className="sign-in-buttons">
              <GoogleAuth isSignIn />
              <p className="or-div"> &nbsp; OR &nbsp; &nbsp;</p>
              <div className="email-sign-in">
                {!validCred && (
                  <PrimaryError
                    message={
                      "We couldn't find an account matching the username and password."
                    }
                  />
                )}
                <form>
                  <Input
                    type={"email"}
                    placeholder={"Email or username"}
                    onChange={setEmail}
                    onfocus={() => {
                      return;
                    }}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    onChange={setPassword}
                    onfocus={() => {
                      return;
                    }}
                  />
                  <Button
                    text="Sign In"
                    blue
                    callback={() => handleSignIn()}
                    isDisabled={isSendingLoginCred}
                    type={"submit"}
                  />
                </form>

                <p className="forgot-password" onClick={gotoForgot}>
                  Forgot Password?
                </p>
              </div>
            </div>
            <p className="sign-up">
              Don't have an account yet?{" "}
              <span onClick={() => navigate("/signup")}>Sign up</span>
            </p>
            <p className="sign-up">
              Register as a Writer{" "}
              <span onClick={() => navigate("/login/writer")}>Register</span>
            </p>
          </div>
        )}

        {displayPage === "forgot-password" && (
          <ForgotPassword setDisplayPage={setDisplayPage} />
        )}
        {displayPage === "verifyOTP" && (
          <VerifyOTP setDisplayPage={setDisplayPage} />
        )}
        {displayPage === "set-new-password" && (
          <SetNewPassword setDisplayPage={setDisplayPage} />
        )}
        <div className="bubble_background_container">
          <img
            src={BackgroundRight}
            className="onboarding-bubble-image"
            alt="left-background"
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
