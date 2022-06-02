import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getForgotOTP, verifyForgotOTP } from "./loginSignupAction";
import { userPhone } from "../user/userActions";
import MuiPhoneNumber from "material-ui-phone-number";
import "./../../index.css";
import { Timer } from "./Timer";
import { Error as WrongNumberError } from "./helper_functions/error";
import { BlueTextField } from "../../utils/common";

const ForgotPasswordNumber = ({
  setOpenDialog,
  setOpenNewPassword,
  setEntityForDialog,
  setTypeForDialog
}) => {
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP, setOTP] = useState("");
  const [isValidOTP, setIsValidOTP] = useState("");
  const [OTPSent, setOTPSent] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [disableResendButton, setDisableResendButton] = useState(false);

  const {
    isGettingForgotOTP,
    getForgotOTPError,
    getForgotOTPErrorMsg,
    getForgotOTPResp,
    isVerifyingForgotOTP,
    verifyForgotOTPError,
    verifyForgotOTPErrorMsg,
    user,
    userPhoneNumber
  } = useSelector(state => ({
    isGettingForgotOTP: state.loginSignup.isGettingForgotOTP,
    getForgotOTPError: state.loginSignup.getForgotOTPError,
    getForgotOTPErrorMsg: state.loginSignup.getForgotOTPErrorMsg,
    getForgotOTPResp: state.loginSignup.getForgotOTPResp,
    isVerifyingForgotOTP: state.loginSignup.isVerifyingForgotOTP,
    verifyForgotOTPError: state.loginSignup.verifyForgotOTPError,
    verifyForgotOTPErrorMsg: state.loginSignup.verifyForgotOTPErrorMsg,
    user: state.user,
    userPhoneNumber: state.user.userPhoneNumber
  }));

  const dispatch = useDispatch();
  const [resendNumber, setResendNumber] = useState("");
  const [phoneInputColor, setPhoneInputColor] = useState("primary");
  const [otpInputColor, setOtpInputColor] = useState("primary");
  useEffect(() => {
    isValidNumber ? setPhoneInputColor("primary") : setPhoneInputColor("error");
  }, [isValidNumber]);

  const handlegetForgotOTP = number => {
    setOTPSent(false);
    number = number.replace("-", "");
    number = number.replace(" ", "");
    setIsValidOTP("");
    if (number.length >= 10) {
      if (phoneNumber.slice(0, 3) === "+91") {
        dispatch(
          getForgotOTP({
            phone: number.slice(3), //Slicing this because in case of Indian Users we only need to send the number without the country code
            international: false
          })
        );
      } else {
        dispatch(
          getForgotOTP({
            phone: number,
            international: true
          })
        );
      }
      setIsValidNumber(true);
      setResendNumber(number);
    } else {
      setResendNumber(number);
      setIsValidNumber(false);
    }
  };

  useEffect(() => {
    if (getForgotOTPError) {
      setIsValidNumber(false); //false

      setOTPSent(false); //false
      // This both should come below
    } else {
      setIsValidNumber(true);
      if (!isGettingForgotOTP && isValidNumber) {
        setOTPSent(true);
        setDisableButton(true);
        setDisableResendButton(true);
        setTimeout(() => {
          setDisableResendButton(false);
        }, 15000);
      }
    }
  }, [isGettingForgotOTP]);

  const handleSubmit = e => {
    //async
    e.preventDefault();
    if (OTP.length > 2) {
      let number = phoneNumber.replace("(", "");
      number = number.replace(")", "");
      if (
        phoneNumber.slice(0, 3) === "+91" ||
        phoneNumber.slice(0, 3) === "+1("
      ) {
        setEntityForDialog(resendNumber.slice(3));
        dispatch(
          verifyForgotOTP({
            phone: phoneNumber.slice(0, 3) === "+91" ? phoneNumber : number,
            code: OTP,
            international: phoneNumber.slice(0, 3) === "+91" ? false : true,
            sessionId: getForgotOTPResp.sessionId
          })
        );
      } else {
        setEntityForDialog(resendNumber);
        dispatch(
          verifyForgotOTP({
            phone: number,
            code: OTP,
            international: true
          })
        );
      }
    } else {
      setIsValidOTP(false);
      setOtpInputColor("error");
    }
  };

  useEffect(() => {
    if (isValidOTP) {
      setOpenDialog(false);
      setTypeForDialog("phone");
      setOpenNewPassword(true);
    }
  }, [userPhoneNumber, isValidOTP]);

  useEffect(() => {
    if (verifyForgotOTPError) {
      setIsValidOTP(false); //false
      setOtpInputColor("error");
    } else {
      dispatch(userPhone(resendNumber));
      if (!isVerifyingForgotOTP && OTPSent) {
        setIsValidOTP(true);
      }
    }
  }, [isVerifyingForgotOTP]);

  const classes = useStyles();
  return (
    <div className={classes.mobileVerificationCard}>
      <div className={classes.mobileVerififcationTitle}>
        Mobile Verification
      </div>
      <div style={{ marginTop: "1.3rem" }}>
        {!isValidNumber && (
          <WrongNumberError
            message={
              getForgotOTPErrorMsg ||
              `A user with this phone number does not exist.`
            }
          />
        )}
        {isValidOTP === false && (
          <WrongNumberError message={verifyForgotOTPErrorMsg} />
        )}
      </div>

      {OTPSent && (
        <SuccessfullOTPSent
          number={resendNumber}
          handlegetForgotOTP={handlegetForgotOTP}
          disableResendButton={disableResendButton}
        />
      )}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className={classes.mobileVerififcationOTPSection}>
          <div className={classes.mobileVerificationInput}>
            <MuiPhoneNumber
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "10px"
                }
              }}
              color={phoneInputColor}
              className={classes.numberClass}
              defaultCountry={"in"}
              enableLongNumbers={true}
              onChange={val => {
                setDisableButton(false);
                val = val.includes(" ") ? val.replaceAll(" ", "") : val;
                val = val.includes("-") ? val.replaceAll("-", "") : val;
                setPhoneNumber(val);
              }}
              countryCodeEditable={true}
              disableAreaCodes={true}
              autoFormat={true}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  handlegetForgotOTP(phoneNumber);
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
              onClick={() => {
                handlegetForgotOTP(phoneNumber);
              }}
              disabled={isGettingForgotOTP}
            >
              {isGettingForgotOTP && (
                <CircularProgress size={20} style={{ color: "white" }} />
              )}
              {!isGettingForgotOTP && "Get OTP"}
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
              disabled={true}
            >
              Get OTP
            </Button>
          )}
        </div>
        <BlueTextField
          label="Enter Verification Code"
          variant="outlined"
          color={otpInputColor}
          fullWidth
          type="number"
          required
          onChange={e => {
            if (e.target.value.length > 6) {
              e.target.value = e.target.value.slice(0, 6);
            }
            setOTP(e.target.value);
          }}
          disabled={!OTPSent}
          className={classes.numberClass}
        />
        <button
          className={
            !OTPSent || isVerifyingForgotOTP
              ? classes.nextButtonDisabled
              : classes.nextButton
          }
          type="submit"
          disabled={!OTPSent || isVerifyingForgotOTP}
        >
          {isVerifyingForgotOTP && (
            <CircularProgress size={20} style={{ color: "black" }} />
          )}
          {!isVerifyingForgotOTP && "Next"}
        </button>
      </form>
    </div>
  );
};

const SuccessfullOTPSent = ({
  number,
  handlegetForgotOTP,
  disableResendButton
}) => {
  const classes = useStyles();
  return (
    <div className={classes.successfullOTPSent}>
      <div className={classes.successfullOTPSentMsg}>
        We have sent a verification code to <b>{number}</b>
      </div>
      <div className={classes.resendText}>
        {!disableResendButton ? (
          <Button
            onClick={() => handlegetForgotOTP(number)}
            sx={{
              "&.MuiButton-text": { color: "black" },
              height: "1.5em",
              width: "10px",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "0.9em",
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
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  mobileVerificationCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    width: "30em",
    padding: "1em",
    // minWidth: '300px',
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      width: "30em",
      height: "calc(100% - 4vh)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginTop: "0",
      minWidth: "0px"
    }
  },
  nextButton: {
    // border: "2px black solid",
    backgroundColor: "white",
    fontFamily: "Poppins",
    padding: "2%",
    marginTop: "2.5em",
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
      color: "#6B6B6B"
    }
  },
  nextButtonDisabled: {
    backgroundColor: "white",
    fontFamily: "Poppins",
    padding: "2%",
    marginTop: "2.5em",
    border: "3px solid #D3D3D3",
    fontWeight: "700",
    width: "100%",
    borderRadius: "10px",
    color: "#D3D3D3",
    fontSize: "0.9em",
    textTransform: "capitalize",
    textDecoration: "bold"
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
  numberClass: {
    width: "100%",
    marginRight: "1em"
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
    width: "20em",
    borderRadius: "15px"
  },

  successfullOTPSent: {
    display: "flex",
    backgroundColor: "#FFDC9A",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "0.6em 0.2em 0.6em 0.2em",

    marginTop: "1em"
  },

  successfullOTPSentMsg: {
    width: "fit-content",
    marginLeft: "1.1em",
    padding: "0.2em 0 0.2em 0"
  },

  successfullOTPSentResend: {
    color: "black",
    borderBottom: "1px solid black",
    cursor: "pointer",

    padding: "0.2em 0 0.2em 0"
  },

  wrongOTP: {
    display: "flex",
    backgroundColor: "#FFBBBA",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "0.5em 0em 0.5em 0em",
    justifyContent: "space-around",
    alignItems: "center"
  },

  wrongOTPMsg: {
    width: "80%"
  },
  resendText: {
    width: "max-content",
    marginLeft: "0.9em",

    padding: "0.2em 0 0.2em 0"
  }
});

export default ForgotPasswordNumber;
