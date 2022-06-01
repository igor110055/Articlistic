import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../../Images/logo.svg";
import { ReactComponent as GoogleLogo } from "../../Images/GoogleLogo.svg";
import Button from "./components/primary-button/button";
import { ReactComponent as ErrorSvg } from "../../Images/VectorErrorAlert.svg";
import ForgotPassword from "./components/forgot-password/forgot-password";
import { validateEmail, validatePassword } from "../../utils/common";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./signupActions";
import Input from "./components/primary-input/input";
import PrimaryError from "./components/primary-error/primaryError";
import { userEmail, userUsername, userPName } from "../user/userActions";
import VerifyOTP from "./components/forgot-password/verifyOTP";
import "./signin.css";
import OnboardingNavbar from "../navbar/onBoardingNavbar";
import SetNewPassword from "./components/forgot-password/setNewPassword";
import Cookie from "js-cookie";

function SignIn() {
  const {
    isSendingLoginCred,
    loginError,
    loginErrorMsg,
    isLoggedIn,
    loginResp,
    user,
  } = useSelector((state) => ({
    isSendingLoginCred: state.signupReducer.isSendingLoginCred,
    loginError: state.signupReducer.loginError,
    loginErrorMsg: state.signupReducer.loginErrorMsg,
    isLoggedIn: state.signupReducer.isLoggedIn,
    loginResp: state.signupReducer.loginResp,
    user: state.user,
  }));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validCred, setValidCred] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("username");
  // const [validPassword, setValidPassword] = useState("");
  const [displayPage, setDisplayPage] = useState("sign-in");
  const signInWithGoogle = () => {};
  const gotoForgot = () => {
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
    if (accessToken) navigate("/writerDashboard");
  });

  useEffect(() => {
    if (!loginError && isLoggedIn) {
      setValidCred(true);
      // console.log(loginResp);

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

      navigate("/writerDashboard");
    } else if (loginError) setValidCred(false);
  }, [loginError, isLoggedIn]);

  return (
    <div>
      <OnboardingNavbar />
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
              {/* {!validCred && (
                <p className="wrong-email">
                  <div className="error-svg">
                    <ErrorSvg />{" "}
                  </div>
                  <span>
                    We couldn’t find an account matching the email and password
                    you entered.
                  </span>
                </p>
              )} */}
              {!validCred && (
                <PrimaryError
                  message={
                    "We couldn't find an account matching the username and password."
                  }
                />
              )}
              {/* <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input type="password" placeholder="Password" /> */}
              <Input
                type={"email"}
                placeholder={"Email or username"}
                onChange={setEmail}
              />
              <Input
                type="password"
                placeholder="Password"
                onChange={setPassword}
              />
              <Button
                text="Sign In"
                blue
                callback={() => handleSignIn()}
                isDisabled={isSendingLoginCred}
              />

              <p className="forgot-password" onClick={gotoForgot}>
                Forgot Password?
              </p>
            </div>
          </div>
          <p className="sign-up">
            Don't have an account yet?{" "}
            <span onClick={() => navigate("/signup")}>Sign up</span>
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
    </div>
  );
}

export default SignIn;
