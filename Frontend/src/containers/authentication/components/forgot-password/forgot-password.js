import { useState, useEffect } from "react";
import Button from "../primary-button/button";
import { ReactComponent as OtherOptions } from "../../../../Images/VectorOtherOptions.svg";
import PrimaryInput from "../primary-input/input";
import { validateEmail } from "../../../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import "./forgot-password.css";
import PrimaryError from "../primary-error/primaryError";
import { getForgotEmailOTP } from "../../signupActions";
function ForgotPassword({ setDisplayPage }) {
  const {
    isGettingForgotEmailOTP,
    getForgotEmailOTPError,
    getForgotEmailSuccess,
    getForgotEmailOTPResp,
    getForgotEmailOTPErrorMsg,
  } = useSelector((state) => ({
    getForgotEmailOTPError: state.signupReducer.getForgotEmailOTPError,
    getForgotEmailSuccess: state.signupReducer.getForgotEmailSuccess,
    isGettingForgotEmailOTP: state.signupReducer.isGettingForgotEmailOTP,
    getForgotEmailOTPResp: state.signupReducer.isGettingForgotEmailOTP,
    getForgotEmailOTPErrorMsg: state.signupReducer.getForgotEmailOTPErrorMsg,
  }));
  const [email, setEmail] = useState("");
  const [validClick, setValidClick] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const gotoSignIn = () => {
    setDisplayPage("sign-in");
  };

  useEffect(() => {
    const forgotPasswordEmail = localStorage.getItem("forgotPasswordEmail");
    const forgotPasswordUserId = localStorage.getItem("forgotPasswordUserId");
    if (forgotPasswordUserId !== null && forgotPasswordEmail !== null)
      setDisplayPage("set-new-password");
  }, []);

  useEffect(() => {
    if (getForgotEmailSuccess) {
      setValidClick(true);
      setError(false);
      if (localStorage.getItem("forgotPasswordEmail") !== null)
        setDisplayPage("verifyOTP");
    } else if (getForgotEmailOTPError) {
      // console.log(getForgotEmailOTPErrorMsg);
      setError(true);
      setValidClick(true);
    }
  }, [getForgotEmailOTPError, getForgotEmailSuccess]);

  const handleSendOTP = () => {
    if (!validateEmail(email)) {
      setValidClick(false);
      return;
    }
    setValidClick(true);
    dispatch(getForgotEmailOTP(email));
    localStorage.setItem("forgotPasswordEmail", email);
  };

  return (
    <div className="forgot-password-container">
      <h3 className="forgot-password-header">Forgot Password?</h3>
      <p className="forgot-password-subtitle">
        Don't worry, happens to the best of us. Enter the email address
        associated with your Attentioun account.
      </p>
      <div className="forgot-password-button-container">
        <PrimaryInput
          placeholder={"Enter your email address"}
          onChange={setEmail}
          onfocus={() => {}}
        />
        {!validClick && <PrimaryError message={"Enter Valid Email address"} />}
        {error && <PrimaryError message={getForgotEmailOTPErrorMsg} />}
        <Button
          blue
          text={"Send OTP"}
          callback={handleSendOTP}
          isDisabled={isGettingForgotEmailOTP}
        />
      </div>
      <div className="back-sign-in" onClick={gotoSignIn}>
        <OtherOptions className="other-options-svg" />
        <p className="other-options-text">Back to sign in</p>
      </div>
    </div>
  );
}

export default ForgotPassword;
