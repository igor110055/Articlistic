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
  const { getForgotEmailOTPError, getForgotEmailSuccess } = useSelector(
    (state) => ({
      getForgotEmailOTPError: state.signupReducer.getForgotEmailOTPError,
      getForgotEmailSuccess: state.signupReducer.getForgotEmailSuccess,
    })
  );
  const [email, setEmail] = useState("");
  const [validClick, setValidClick] = useState(true);
  const dispatch = useDispatch();
  const gotoSignIn = () => {
    setDisplayPage("sign-in");
  };

  useEffect(() => {
    if (
      localStorage.getItem("forgotPasswordUserId") &&
      localStorage.getItem("forgotPasswordEmail")
    )
      setDisplayPage("setNewPassword");
  }, []);
  useEffect(() => {
    if (!getForgotEmailOTPError && getForgotEmailSuccess)
      setDisplayPage("verifyOTP");
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
        />
        {!validClick && <PrimaryError message={"Enter Valid Email address"} />}
        <Button blue text={"Send OTP"} callback={handleSendOTP} />
      </div>
      <div className="back-sign-in" onClick={gotoSignIn}>
        <OtherOptions className="other-options-svg" />
        <p className="other-options-text">Back to sign in</p>
      </div>
    </div>
  );
}

export default ForgotPassword;
