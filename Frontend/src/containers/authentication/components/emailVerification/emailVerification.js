import { useEffect, useState } from "react";
import "./emailVerification.css";
import { validateEmail } from "../../../../utils/common";
import { ReactComponent as OtherOptions } from "../../../../Images/VectorOtherOptions.svg";
import Button from "../primary-button/button";
import VerifyOtp from "../verifyOtp/verify-otp";
import Input from "../primary-input/input";
import { useDispatch, useSelector } from "react-redux";
import { getEmailOTPInit } from "../../signupActions";
import PrimaryError from "../primary-error/primaryError";
import left_img from "../../../../Images/background-left.svg";
import right_img from "../../../../Images/background-right.svg";
function EmailVerification({ setDisplayPage }) {
  const { isGettingEmailOTP, getEmailOTPError, getEmailOTPSuccess } =
    useSelector((state) => ({
      isGettingEmailOTP: state.signupReducer.isGettingEmailOTP,
      getEmailOTPError: state.signupReducer.getEmailOTPError,
      getEmailOTPErrorMsg: state.signupReducer.getEmailOTPErrorMsg,
      getEmailOTPResp: state.signupReducer.getEmailOTPResp,
      getEmailOTPSuccess: state.signupReducer.getEmailOTPSuccess,
    }));

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [validClick, setValidClick] = useState(true);
  const [once, setOnce] = useState(false);
  const [usedEmail, setUsedEmail] = useState(false);
  const [displaySection, setDisplaySection] = useState("enterEmail");
  const handleContinue = () => {
    if (email === "") {
      setValidClick(false);
      return;
    }
    setOnce(true);
    if (validateEmail(email)) {
      setValidClick(true);
      setUsedEmail(false);
      dispatch(getEmailOTPInit(email));
      localStorage.setItem("userEmail", email);
    } else {
      setValidClick(false);
    }
  };

  useEffect(() => {
    if (once) {
      setValidClick(true);
      if (getEmailOTPSuccess && !getEmailOTPError) {
        setUsedEmail(false);
        setDisplaySection("enterOTP");
      } else if (getEmailOTPError) {
        setUsedEmail(true);
      }
    }
  }, [getEmailOTPSuccess, getEmailOTPError]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="bubble_background_container">
        <img
          src={left_img}
          className="onboarding-bubble-image"
          alt="left-img"
        />
      </div>
      {displaySection === "enterEmail" && (
        <div className="sign-up-with-email-container">
          <h3 className="sign-up-with-email-header">Sign up with your email</h3>
          <div className="email-input-div">
            <form>
              <Input
                placeholder={"Enter your email address"}
                type={"email"}
                labelName={"Email address"}
                inputBorderColor={!validClick ? "#EB4335" : "#c4c4c4"}
                labelColor={!validClick ? "#EB4335" : "#777983"}
                onChange={setEmail}
                onfocus={() => {}}
              />
              {!validClick && (
                <PrimaryError message={"Please enter a valid email address"} />
              )}
              {usedEmail && (
                <PrimaryError message={"This email is already in use"} />
              )}
              <Button
                text="Continue"
                blue
                callback={handleContinue}
                isDisabled={isGettingEmailOTP}
                type={"submit"}
              />
            </form>
          </div>
          <div className="other-options" onClick={() => setDisplayPage("")}>
            <OtherOptions className="other-options-svg" />
            <p className="other-options-text">Other sign up options</p>
          </div>
        </div>
      )}

      {displaySection === "enterOTP" && (
        <div style={{ width: "100%" }}>
          <VerifyOtp setDisplayPage={setDisplayPage} email={email} />
        </div>
      )}
      <div className="bubble_background_container">
        <img
          src={right_img}
          className="onboarding-bubble-image"
          alt="left-img"
        />
      </div>
    </div>
  );
}

export default EmailVerification;
