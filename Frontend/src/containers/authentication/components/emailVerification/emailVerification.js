import { useEffect, useState } from "react";
import "./emailVerification.css";
import { validateEmail } from "../../../../utils/common";
import { ReactComponent as OtherOptions } from "../../../../Images/VectorOtherOptions.svg";
import { ReactComponent as ErrorSvg } from "../../../../Images/VectorErrorAlert.svg";
import Button from "../primary-button/button";
import VerifyOtp from "../verifyOtp/verify-otp";
import Input from "../primary-input/input";
import { useDispatch, useSelector } from "react-redux";
import { getEmailOTPInit } from "../../signupActions";
import PrimaryError from "../primary-error/primaryError";
function EmailVerification({ setDisplayPage }) {
  const {
    isGettingEmailOTP,
    getEmailOTPError,
    getEmailOTPErrorMsg,
    getEmailOTPResp,
    getEmailOTPSuccess,
  } = useSelector((state) => ({
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
    setUsedEmail(false);
    setOnce(true);
    // console.log(email);
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
    <div>
      {displaySection === "enterEmail" && (
        <div className="sign-up-with-email-container">
          <h3 className="sign-up-with-email-header">Sign up with your email</h3>
          <div className="email-input-div">
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
            />
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
    </div>
  );
}

export default EmailVerification;
