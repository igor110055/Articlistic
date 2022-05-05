import { Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOTP, verifyOTP } from "./loginSignupAction";
import { userPhone } from "../user/userActions";
import MuiPhoneNumber from "material-ui-phone-number";
import "./../../index.css";
import { Timer } from "./Timer";

import { Error as WrongNumberError } from "./helper_functions/error";
import { ErrorMessage } from "./helper_functions/errorMessageFunction";

const MobileVerification = ({ setDisplayPage, displayPage }) => {
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
    userPhoneNumber
  } = useSelector(state => ({
    isGettingOTP: state.loginSignup.isGettingOTP,
    getOTPError: state.loginSignup.getOTPError,
    getOTPErrorMsg: state.loginSignup.getOTPErrorMsg,
    getOTPResp: state.loginSignup.getOTPResp,
    isVerifyingOTP: state.loginSignup.isVerifyingOTP,
    verifyOTPError: state.loginSignup.verifyOTPError,
    verifyOTPErrorMsg: state.loginSignup.verifyOTPErrorMsg,
    user: state.user,
    userPhoneNumber: state.user.userPhoneNumber
  }));

  const dispatch = useDispatch();
  const [resendNumber, setResendNumber] = useState("");
  const handleGetOTP = number => {
    number = number.replace("-", "");
    number = number.trim();
    number = number.replace("(", "");
    number = number.replace(")", "");
    setOTPSent(false);
    setFinalCountry(country);
    if (number.length >= 10) {
      setIsValidNumber(true);
      setResendNumber(number);
      if (phoneNumber.slice(0, 3) === "+91") {
        dispatch(
          getOTP({
            phone: number.slice(3),
            international: false
          })
        );
      } else {
        dispatch(
          getOTP({
            phone: number,
            international: true
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
        }, [15000]);
      }
    }
  }, [isGettingOTP]);

  const handleSubmit = e => {
    //async
    setErrorOccured(false);
    e.preventDefault();
    let number = phoneNumber.replace("(", "");
    number = number.replace(")", "");
    if (OTP.length === 6) {
      if (
        phoneNumber.slice(0, 3) === "+91" ||
        phoneNumber.slice(0, 3) === "+1("
      ) {
        dispatch(
          verifyOTP({
            phone:
              phoneNumber.slice(0, 3) === "+91" ? phoneNumber.slice(3) : number,
            code: OTP,
            international: phoneNumber.slice(0, 3) === "+91" ? false : true,
            sessionId: getOTPResp.sessionId
          })
        );
      } else {
        dispatch(
          verifyOTP({
            phone: number,
            code: OTP,
            international: true
          })
        );
      }
    } else {
      setIsValidOTP(false);
      setOtpInput("error");
    }
  };

  useEffect(() => {
    if (isValidOTP && displayPage === "mobileVerification") {
      localStorage.setItem("user", JSON.stringify(user));
      setDisplayPage("emailVerification");
    }
  }, [userPhoneNumber, isValidOTP]);

  useEffect(() => {
    if (verifyOTPError) {
      setOtpInput("error");
      setIsValidOTP(false); //false
      setErrorOccured(false);
    } else {
      dispatch(userPhone(resendNumber));
      if (!isVerifyingOTP && OTPSent) {
        setIsValidOTP(true);
      }
      setErrorOccured(false);
    }
  }, [isVerifyingOTP]);

  const classes = useStyles();
  return (
    <div className={classes.mobileVerifyDiv}>
      <div className={classes.mobileVerificationCard}>
        <div className={classes.mobileVerififcationTitle}>
          Mobile Verification
        </div>
        {!isValidNumber && (
          <WrongNumberError message={getOTPErrorMsg || "Not a valid number"} />
        )}
        {isValidOTP === false && (
          <WrongNumberError
            message={
              ErrorMessage(verifyOTPErrorMsg) ||
              "Verification Code must be of atleast 6 digits"
            }
          />
        )}
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
              <MuiPhoneNumber
                fullWidth
                defaultCountry={"in"}
                variant="outlined"
                enableLongNumbers={true}
                color={inputBorderColor}
                classes={{
                  inputProps: {
                    color: "#636363",
                    fontFamily: "Poppins"
                  }
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "10px"
                  }
                }}
                inputProps={{
                  fontFamily: "Poppins"
                }}
                onChange={val => {
                  setDisableButton(false);
                  val = val.includes(" ") ? val.replaceAll(" ", "") : val;
                  val = val.includes("-") ? val.replaceAll("-", "") : val;

                  setPhoneNumber(val);
                }}
                countryCodeEditable={true}
                disableAreaCodes={true}
                autoFormat={true}
                onKeyDown={e => {
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
                  height: "3.4em",
                  width: "7.9375em",
                  fontFamily: "Poppins",
                  fontWeight: "700",
                  backgroundColor: "primary",
                  fontSize: "1em",
                  textTransform: "capitalize",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)"
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
                  "&.MuiButton-text": { color: "white" },
                  height: "3.4em",
                  width: "7.9375em",
                  marginLeft: "0.9em",
                  fontFamily: "Poppins",
                  fontWeight: "700",
                  fontSize: "1em",
                  textTransform: "capitalize",
                  borderRadius: "10px",
                  filter: "opacity(0.5)",

                  background:
                    "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)"
                }}
                onClick={() => handleGetOTP(phoneNumber)}
                disabled={isGettingOTP || disableButton}
              >
                Get OTP
              </Button>
            )}
          </div>
          <TextField
            label="Enter Verification Code"
            fullWidth
            variant="outlined"
            sx={{
              fieldset: {
                borderRadius: "10px"
              }
            }}
            InputLabelProps={{
              style: {
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: "500"
              }
            }}
            color={otpInputColor}
            inputProps={{
              style: {
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: "500"
              }
            }}
            type="number"
            onChange={e => {
              if (e.target.value.length > 6) {
                e.target.value = e.target.value.slice(0, 6);
              }
              setOTP(e.target.value);
            }}
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
    </div>
  );
};

const SuccessfullOTPSent = ({
  number,
  handleGetOTP,
  finalCountry,
  disableResendButton
}) => {
  const classes = useStyles();
  return (
    <div className={classes.successfullOTPSent}>
      <span className={classes.successfullOTPSentMsg}>
        We have sent a verification code to <b>{number}</b>
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
              borderRadius: "0px"
            }}
            disabled={disableResendButton}
          >
            Resend
          </Button>
        ) : (
          <Timer time={15} />
        )}
      </span>
    </div>
  );
};

const useStyles = makeStyles({
  mobileVerificationCard: {
    backgroundColor: "white",
    width: "29em",
    borderRadius: "10px",
    height: "fit-content",
    padding: "2em 2em 0 2em",
    minWidth: "30.25em",
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      width: "100%",
      height: "calc(100% - 4vh)",
      borderRadius: "0px 0px 0px 0px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginTop: "0",
      minWidth: "0px"
    },
    boxShadow: "20px 32px 64px 0px rgba(214, 230, 255, 0.5)"
  },
  mobileNumber: {
    width: "20em",
    borderRadius: "10px !important"
  },
  nextButton: {
    // border: "2px black solid",
    backgroundColor: "white",
    fontFamily: "Poppins",
    paddingTop: "0.9em",
    paddingBottom: "0.9em",
    marginTop: "2em",
    border: "3px solid #6B6B6B",
    fontWeight: "700",
    width: "100%",
    borderRadius: "10px",
    color: "#6B6B6B",
    fontSize: "0.9em",
    textTransform: "capitalize",
    textDecoration: "bold",
    marginBottom: "2em",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#6B6B6B"
    }
  },
  nextButtonDisabled: {
    backgroundColor: "white",
    fontFamily: "Poppins",
    paddingTop: "0.9em",
    paddingBottom: "0.9em",
    marginTop: "2.1em",
    border: "3px solid #D3D3D3",
    fontWeight: "700",
    width: "100%",
    borderRadius: "10px",
    color: "#D3D3D3",
    fontSize: "0.9em",
    textTransform: "capitalize",
    textDecoration: "bold",
    marginBottom: "2em"
  },

  mobileVerififcationTitle: {
    fontFamily: "Merriweather",
    color: "#0A2B98",
    fontWeight: "700",
    fontSize: "1.6em",
    paddingBottom: "2%",
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      width: "100%",
      display: "flex",
      alignItems: "flex-start"
    }
  },
  mobileVerifyDiv: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  mobileVerififcationOTPSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5%",
    marginBottom: "5%",
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      width: "100%"
    }
  },

  mobileVerificationInput: {
    width: "70%"
  },

  successfullOTPSent: {
    display: "flex",
    backgroundColor: "#FFDC9A",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "0.7em 0 0.7em 0",
    justifyContent: "space-around",
    marginTop: "1em",
    marginRight: "1em"
  },

  successfullOTPSentMsg: {
    width: "70%",
    paddingLeft: "1em"
  },

  successfullOTPSentResend: {
    color: "black",
    outline: "none",
    border: "none",
    backgroundColor: "transparent",
    textDecoration: "underline"
    // cursor: 'pointer',
  }
});

export default MobileVerification;
