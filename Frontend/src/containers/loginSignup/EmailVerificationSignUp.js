import { Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOTP, verifyOTP } from "./loginSignupAction";
import { userPhone } from "../user/userActions";
import "./../../index.css";
import { Timer } from "./Timer";
import { Error as WrongNumberError } from "./helper_functions/error";

const EmailVerificationSignUp = ({ setDisplayPage, displayPage }) => {
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP, setOTP] = useState("");
  const [isValidOTP, setIsValidOTP] = useState("");
  const [OTPSent, setOTPSent] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [country, setCountry] = useState("91");
  const [finalCountry, setFinalCountry] = useState("91");
  const [disableButton, setDisableButton] = useState(false);
  const [disableResetbutton, setDisableResendButton] = useState(false);
  const [inputBorderColor, setBorderColor] = useState("primary");
  const [otpInputColor, setOtpInput] = useState("primary");

  const {
    isGettingOTP,
    getOTPError,
    getOTPErrorMsg,
    getOTPResp,
    isVerifyingOTP,
    verifyOTPError,
    verifyOTPErrorMsg,
    user,
    userPhoneNumber,
  } = useSelector((state) => ({
    isGettingOTP: state.loginSignup.isGettingOTP,
    getOTPError: state.loginSignup.getOTPError,
    getOTPErrorMsg: state.loginSignup.getOTPErrorMsg,
    getOTPResp: state.loginSignup.getOTPResp,
    isVerifyingOTP: state.loginSignup.isVerifyingOTP,
    verifyOTPError: state.loginSignup.verifyOTPError,
    verifyOTPErrorMsg: state.loginSignup.verifyOTPErrorMsg,
    user: state.user,
    userPhoneNumber: state.user.userPhoneNumber,
  }));

  const dispatch = useDispatch();
  const [resendNumber, setResendNumber] = useState("");
  const handleGetOTP = (number) => {
    setOTPSent(false);
    setFinalCountry(country);
    if (number.length >= 10) {
      setIsValidNumber(true);
      setResendNumber(number);
      // console.log(country);
      if (true) {
        dispatch(
          getOTP({
            email: number,
          })
        );
      }
    } else {
      // setResendNumber(number);
      // dispatch(getOTP(number));
      setIsValidNumber(false);
    }
  };
  useEffect(() => {
    if (isValidOTP === false) setOtpInput("error");
  }, [isValidOTP]);

  useEffect(() => {
    if (isValidNumber) {
      setBorderColor("primary");
    } else {
      setBorderColor("error");
    }
  }, [isValidNumber]);
  // console.log(finalCountry);

  useEffect(() => {
    if (getOTPError) {
      setIsValidNumber(false); //false
      setOTPSent(false); //false
      // This both should come below
    } else {
      setIsValidNumber(true);
      if (isValidNumber && !isGettingOTP) {
        setOTPSent(true);
        setDisableButton(true);
        setDisableResendButton(true);
        setTimeout(() => {
          setDisableResendButton(false);
        }, [30000]);
      }
    }
  }, [isGettingOTP]);

  const handleSubmit = (e) => {
    //async
    setErrorOccured(false);
    e.preventDefault();
    if (OTP.length > 2) {
      if (phoneNumber.slice(0, 3) === "+91") {
        dispatch(
          verifyOTP({
            phone: phoneNumber,
            code: OTP,
          })
        );
      } else {
        dispatch(
          verifyOTP({
            phone: phoneNumber,
            code: OTP,
          })
        );
      }
    } else {
      setIsValidOTP(false);
      setOtpInput("error");
    }
  };

  useEffect(() => {
    if (isValidOTP && displayPage === "emailVerification") {
      localStorage.setItem("user", JSON.stringify(user));
      // console.log(user);
      setDisplayPage("createProfile");
    }
  }, [userPhoneNumber, isValidOTP]);

  useEffect(() => {
    if (verifyOTPError) {
      setOtpInput("error");
      setIsValidOTP(false); //false
      setErrorOccured(false);
    } else {
      // console.log(resendNumber, OTPSent);
      dispatch(userPhone(resendNumber));
      if (!isVerifyingOTP && OTPSent) {
        // console.log('1');
        setIsValidOTP(true);
      }
      setErrorOccured(false);
    }
  }, [isVerifyingOTP]);

  const classes = useStyles();
  return (
    <div className={classes.mobileVerificationCard}>
      <div className={classes.mobileVerififcationTitle}>Email Verification</div>
      {!isValidNumber && (
        <WrongNumberError message={getOTPErrorMsg || "Not a valid email"} />
      )}
      {isValidOTP === false && <WrongNumberError message={verifyOTPErrorMsg} />}
      {OTPSent && (
        <SuccessfullOTPSent
          number={resendNumber}
          handleGetOTP={handleGetOTP}
          finalCountry={finalCountry}
          disableResendButton={disableResetbutton}
        />
      )}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className={classes.mobileVerififcationOTPSection}>
          <div className={classes.mobileVerificationInput}>
            <TextField
              label="Enter Email Address"
              variant="outlined"
              enableLongNumbers={true}
              color={inputBorderColor}
              className={classes.mobileNumber}
              onChange={(val) => {
                setDisableButton(false);
                setPhoneNumber(val);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGetOTP(phoneNumber);
                }
              }}
            />
          </div>
          {!disableButton ? (
            <Button
              sx={{
                "&.MuiButton-text": { color: "white" },
                height: "4em",
                width: "25%",
                fontFamily: "Poppins",
                fontWeight: "700",
                backgroundColor: "primary",
                fontSize: "0.9em",
                textTransform: "capitalize",
                background:
                  "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
              }}
              onClick={() => handleGetOTP(phoneNumber)}
              disabled={isGettingOTP}
            >
              {isGettingOTP && (
                <CircularProgress size={20} style={{ color: "white" }} />
              )}
              {!isGettingOTP && "get OTP"}
            </Button>
          ) : (
            <Button
              sx={{
                "&.MuiButton-text": { color: "black" },
                height: "3.5em",
                width: "10em",
                marginLeft: "0.9em",
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: "0.9em",
                textTransform: "capitalize",
                backgroundColor: "lightgrey",
              }}
              onClick={() => handleGetOTP(phoneNumber)}
              disabled={isGettingOTP || disableButton}
            >
              Get OTP
            </Button>
          )}
        </div>
        <TextField
          label="Enter OTP"
          fullWidth
          variant="outlined"
          color={otpInputColor}
          type="number"
          onChange={(e) => setOTP(e.target.value)}
          disabled={!OTPSent || isGettingOTP || isVerifyingOTP}
        />
        <button
          className={
            !OTPSent || isVerifyingOTP
              ? classes.nextButtonDisabled
              : classes.nextButton
          }
          type="submit"
          disabled={!OTPSent || isVerifyingOTP}
        >
          {isVerifyingOTP && (
            <CircularProgress size={20} style={{ color: "black" }} />
          )}
          {!isVerifyingOTP && "Next"}
        </button>
      </form>
    </div>
  );
};


const SuccessfullOTPSent = ({
  number,
  handleGetOTP,
  finalCountry,
  disableResendButton,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.successfullOTPSent}>
      <span className={classes.successfullOTPSentMsg}>
        We have sent a code to this email.
      </span>
      <span>
        {!disableResendButton ? (
          <Button
            onClick={() => handleGetOTP(number)}
            sx={{
              "&.MuiButton-text": { color: "black" },
              height: "1.5em",
              width: "10px",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "0.9em",
              paddingRight: "4em",
              marginLeft: "1em",
              textTransform: "capitalize",
              textDecoration: "underline",
              borderRadius: "0px",
            }}
            disabled={disableResendButton}
          >
            Resend
          </Button>
        ) : (
          <Timer time={30} />
        )}
      </span>
    </div>
  );
};


const useStyles = makeStyles({
  mobileVerificationCard: {
    backgroundColor: "white",
    width: "29em",
    borderRadius: "20px",
    zIndex: 1,
    padding: "3em",
    minWidth: "300px",
    ["@media (max-width:720px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "100%",
      height: "calc(100% - 4vh)",
      borderRadius: "0px 0px 0px 0px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginTop: "0",
      minWidth: "0px",
    },
    marginTop: "4rem",
    boxShadow: "20px 32px 64px 0px rgba(214, 230, 255, 0.5)",
  },
  mobileNumber: {
    width: "20em",
  },
  nextButton: {
    // border: "2px black solid",
    backgroundColor: "white",
    fontFamily: "Poppins",
    padding: "2%",
    marginTop: "2em",
    border: "3px solid #6B6B6B",
    fontWeight: "700",
    width: "100%",
    borderRadius: "10px",
    color: "#6B6B6B",
    fontSize: "0.9em",
    textTransform: "capitalize",
    textDecoration: "bold",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#6B6B6B",
    },
  },
  nextButtonDisabled: {
    backgroundColor: "white",
    fontFamily: "Poppins",
    padding: "2%",
    marginTop: "2em",
    border: "3px solid #D3D3D3",
    fontWeight: "700",
    width: "100%",
    borderRadius: "10px",
    color: "#D3D3D3",
    fontSize: "0.9em",
    textTransform: "capitalize",
    textDecoration: "bold",
  },

  mobileVerififcationTitle: {
    fontFamily: "Merriweather",
    color: "#0A2B98",
    fontWeight: "700",
    fontSize: "1.6em",
    paddingBottom: "2%",
    ["@media (max-width:720px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "100%",
      display: "flex",
      alignItems: "flex-start",
    },
  },

  mobileVerififcationOTPSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5%",
    marginBottom: "5%",
    ["@media (max-width:720px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "100%",
    },
  },

  mobileVerificationInput: {
    width: "70%",
  },
  enterOtpInput: {
    color: "primary",
  },
  enterOtpInputError: {
    color: "error",
  },

  successfullOTPSent: {
    display: "flex",
    backgroundColor: "#FFDC9A",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "2% 0% 2% 0%",
    justifyContent: "space-between",
    marginTop: "1em",
  },

  successfullOTPSentMsg: {
    width: "fit-content",
    paddingLeft: "2em",
  },

  successfullOTPSentResend: {
    color: "black",
    outline: "none",
    border: "none",
    backgroundColor: "transparent",
    textDecoration: "underline",
    // cursor: 'pointer',
  },

  wrongOTP: {
    display: "flex",
    backgroundColor: "#FFBBBA",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "2% 0% 2% 0%",
    justifyContent: "space-around",
    alignItems: "center",
  },

  wrongOTPMsg: {
    width: "80%",
  },
});

export default EmailVerificationSignUp;
