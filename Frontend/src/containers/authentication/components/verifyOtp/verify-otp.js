import { useState, useEffect } from "react";
import { ReactComponent as ErrorSvg } from "../../../../Images/VectorErrorAlert.svg";
import { useDispatch, useSelector } from "react-redux";
import { getEmailOTPInit, verifyEmailOTPInit } from "../../signupActions";
import "./verify-otp.css";
import { Timer } from "../../Timer";
import ReactPinField from "react-pin-field";
import Button from "../primary-button/button";

import { userEmail } from "../../../user/userActions";
function VerifyOtp({ setDisplayPage, email }) {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [validOtp, setValidOtp] = useState(true);
  const [sentAgain, setSentAgain] = useState(false);
  const {
    isVerifyingEmailOTP,
    verifyEmailOTPError,
    verifyEmailOTPErrorMsg,
    verifyEmailOTPResp,
    emailOTPVerified,
  } = useSelector((state) => ({
    isVerifyingEmailOTP: state.signupReducer.isVerifyingEmailOTP,
    verifyEmailOTPError: state.signupReducer.verifyEmailOTPError,
    verifyEmailOTPErrorMsg: state.signupReducer.verifyEmailOTPErrorMsg,
    verifyEmailOTPResp: state.signupReducer.verifyEmailOTPResp,
    emailOTPVerified: state.signupReducer.emailOTPVerified,
  }));

  const handleVerify = () => {
    // console.log(otp);
    if (otp.length === 6) {
      setValidOtp(true);
      dispatch(verifyEmailOTPInit({ email, otp }));
    } else setValidOtp(false);
  };

  const resendEmail = (email) => {
    setValidOtp(true);
    dispatch(getEmailOTPInit(email));
  };
  useEffect(() => {
    if (sentAgain) {
      setTimeout(() => {
        setSentAgain(false);
      }, 30000);
    }
  }, [sentAgain]);
  useEffect(() => {
    if (!isVerifyingEmailOTP && !verifyEmailOTPError) {
      if (emailOTPVerified) {
        setValidOtp(true);
        localStorage.setItem("createUserId", verifyEmailOTPResp.id);
        // console.log(verifyEmailOTPResp.id);
        dispatch(userEmail(email));
        setDisplayPage("setUpProfile");
      }
    } else if (verifyEmailOTPError) setValidOtp(false);
  }, [verifyEmailOTPError, emailOTPVerified, isVerifyingEmailOTP]);

  return (
    <div className="verify-otp-container">
      <h3 className="verify-otp-header">Check your email</h3>
      <p className="verify-otp-subtitle">
        {`We sent a 6-digit code to ${email} Please enter it below.`}
      </p>
      <div className="pin-container">
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
      </div>
      {!validOtp && (
        <p className="wrong-code">
          <ErrorSvg /> <span>Invalid code. Please try again.</span>
        </p>
      )}
      <Button text="Verify" blue callback={handleVerify} />
      {!sentAgain ? (
        <p
          className="get-code-text"
          onClick={() => {
            resendEmail(email);
            setSentAgain(true);
          }}
        >
          Didn't get the code?
        </p>
      ) : (
        <Timer time={30} />
      )}
    </div>
  );
}

export default VerifyOtp;
