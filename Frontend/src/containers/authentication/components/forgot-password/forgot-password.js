import React from "react";
import Button from "../primary-button/button";
import { ReactComponent as OtherOptions } from "../../../../Images/VectorOtherOptions.svg";
import "./forgot-password.css";
function ForgotPassword({ setDisplayPage }) {
  const gotoSignIn = () => {
    setDisplayPage("sign-in");
  };
  return (
    <div className="forgot-password-container">
      <h3 className="forgot-password-header">Forgot Password?</h3>
      <p className="forgot-password-subtitle">
        Enter the email address you used when you joined and we’ll send you
        instructions to reset your password.
      </p>
      <div className="button-container">
        <input placeholder="Email address" />
        <Button blue text={"Send Reset Instruction"} />
      </div>
      <div className="back-sign-in" onClick={gotoSignIn}>
        <OtherOptions className="other-options-svg" />
        <p className="other-options-text">Back to sign in</p>
      </div>
    </div>
  );
}

export default ForgotPassword;
