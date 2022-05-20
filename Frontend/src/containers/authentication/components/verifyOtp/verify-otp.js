import { useState, useEffect } from "react";
import { ReactComponent as ErrorSvg } from "../../../../Images/VectorErrorAlert.svg";

import "./verify-otp.css";

import ReactPinField from "react-pin-field";
import Button from "../primary-button/button";
function VerifyOtp({ setDisplayPage }) {
  const [otp, setOtp] = useState("");
  const [validOtp, setValidOtp] = useState(true);
  const handleVerify = () => {
    console.log(otp);
    if (otp === "123456") {
      setDisplayPage("setUpProfile");
      setValidOtp(true);
    } else setValidOtp(false);
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
        style={
          !validOtp
            ? {
                borderColor: "#eb4335",
              }
            : {}
        }
      />
      {!validOtp && (
        <p className="wrong-code">
          <ErrorSvg /> <span>Invalid code. Please try again.</span>
        </p>
      )}
      <Button text="Verify" blue callback={handleVerify} />
      <p className="get-code-text">Didn't get the code?</p>
    </div>
  );
}

export default VerifyOtp;
