import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../verifyOtp/verify-otp.css";
import ReactPinField from "react-pin-field";
import Button from "../primary-button/button";
import { ReactComponent as ErrorSvg } from "../../../../Images/VectorErrorAlert.svg";
import { Timer } from "../../Timer";
import { getForgotEmailOTP, verifyForgotEmailOTP } from "../../signupActions";

function VerifyOTP({ setDisplayPage }) {
  const dispatch = useDispatch();

  const email = localStorage.getItem("forgotPasswordEmail");
  const [otp, setOtp] = useState("");
  const [validOtp, setValidOtp] = useState(true);
  const [sentAgain, setSentAgain] = useState(false);

  const {
    isVerifyingForgotEmailOTP,
    verifyForgotEmailOTPError,
    verifyForgotEmailOTPSuccess,
    verifyForgotEmailOTPResp,
  } = useSelector((state) => ({
    verifyForgotEmailOTPError: state.signupReducer.verifyForgotEmailOTPError,
    verifyForgotEmailOTPSuccess:
      state.signupReducer.verifyForgotEmailOTPSuccess,
    verifyForgotEmailOTPResp: state.signupReducer.verifyForgotEmailOTPResp,
    isVerifyingForgotEmailOTP: state.signupReducer.isVerifyingForgotEmailOTP,
  }));

  const handleVerify = () => {
    // console.log(otp);
    if (otp.length === 6) {
      dispatch(verifyForgotEmailOTP({ email, otp }));
      setValidOtp(true);
    } else setValidOtp(false);
  };

  const resendEmail = () => {
    dispatch(getForgotEmailOTP(email));
  };

  useEffect(() => {
    if (!isVerifyingForgotEmailOTP && !verifyForgotEmailOTPError) {
      if (verifyForgotEmailOTPSuccess) {
        setValidOtp(true);
        localStorage.setItem(
          "forgotPasswordUserId",
          verifyForgotEmailOTPResp.id
        );
        // console.log(verifyEmailOTPResp.id);
        // dispatch(userEmail(email));
        setDisplayPage("setNewPassword");
      }
    } else setValidOtp(false);
  }, [
    verifyForgotEmailOTPError,
    verifyForgotEmailOTPSuccess,
    isVerifyingForgotEmailOTP,
  ]);

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
            resendEmail();
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

export default VerifyOTP;
