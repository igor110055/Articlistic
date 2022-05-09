import { useState, useEffect } from "react";
import "./verify-otp.css";

import ReactPinField from "react-pin-field";
import Button from "../primary-button/button";
function VerifyOtp({ setDisplayPage }) {
  const [otp, setOtp] = useState("");
  const handleVerify = () => {
    console.log(otp);
    setDisplayPage("setUpProfile");
  };

  return (
    <div className="verify-otp-container">
      <h3 className="verify-otp-header">Check your email</h3>
      <p className="verify-otp-subtitle">
        We sent a 6-digit code to tushars2k@gmail.com Please enter it below.
      </p>
      <ReactPinField
        className="pin-field"
        length={6}
        placeholder={"_"}
        validate="0123456789"
        onChange={setOtp}
      />
      <Button text="Verify" blue callback={handleVerify} />
      <p className="get-code-text">Didn't get the code?</p>
    </div>
  );
}

export default VerifyOtp;
