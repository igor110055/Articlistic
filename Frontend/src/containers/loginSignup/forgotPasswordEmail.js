import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";
import {BlueTextField, validateEmail } from "../../utils/common";
import { useSelector, useDispatch } from "react-redux";
import { getForgotEmailOTP, verifyForgotEmailOTP } from "./loginSignupAction";
import { userEmail } from "../user/userActions";
import { CircularProgress } from "@mui/material";
import { Error as ErrorInOTP } from "./helper_functions/error";
import { Timer } from "./Timer";
const ForgotPasswordEmail = ({
  setOpenDialog,
  setOpenNewPassword,
  setEntityForDialog,
  setTypeForDialog,
}) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [isValidEmailOTP, setIsValidEmailOTP] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [errorVerifyingOTP, setErrorVerifyingOTP] = useState(false);
  const [errorGettingOTP, setErrorGettingOTP] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [disableResendButton, setDisableResendButton] = useState(false);
  const [emailInputColor, setEmailInputColor] = useState("primary");
  const [otpInputColor, setOtpInputColor] = useState("primary");
  const dispatch = useDispatch();
  useEffect(() => {
    isValidEmail ? setEmailInputColor("primary") : setEmailInputColor("error");
  }, [isValidEmail]);

  const {
    isGettingForgotEmailOTP,
    getForgotEmailOTPError,
    getForgotEmailOTPErrorMsg,
    isVerifyingForgotEmailOTP,
    verifyForgotEmailOTPError,
    verifyForgotEmailOTPErrorMsg,
  } = useSelector((state) => ({
    isGettingForgotEmailOTP: state.loginSignup.isGettingForgotEmailOTP,
    getForgotEmailOTPError: state.loginSignup.getForgotEmailOTPError,
    getForgotEmailOTPErrorMsg: state.loginSignup.getForgotEmailOTPErrorMsg,
    isVerifyingForgotEmailOTP: state.loginSignup.isVerifyingForgotEmailOTP,
    verifyForgotEmailOTPError: state.loginSignup.verifyForgotEmailOTPError,
    verifyForgotEmailOTPErrorMsg:
      state.loginSignup.verifyForgotEmailOTPErrorMsg,
  }));

  useEffect(() => {
    if (validateEmail(email)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  }, [email]);

  const handleGetOTP = (eml) => {
    setErrorGettingOTP(false);
    if (validateEmail(eml)) {
      setResendEmail(eml);
      dispatch(getForgotEmailOTP(eml));
    }
  };

  useEffect(() => {
    if (getForgotEmailOTPError) {
      setEmailOTPSent(false);
      setErrorGettingOTP(true);
    } else {
      if (isValidEmail && !isGettingForgotEmailOTP) {
        setDisableButton(true);
        setDisableResendButton(true);
        setTimeout(() => {
          setDisableResendButton(false);
        }, 15000);
        setEmailOTPSent(true);
      }
    }
  }, [isGettingForgotEmailOTP]);

  const handleSubmit = (e) => {
    setErrorVerifyingOTP(false);
    e.preventDefault();
    setEntityForDialog(resendEmail);
    dispatch(verifyForgotEmailOTP({ email: resendEmail, otp: emailOTP }));
  };

  useEffect(() => {
    if (isValidEmailOTP) {
      // const tempUser = JSON.parse(localStorage.getItem('user'));
      setOpenDialog(false);
      setTypeForDialog("email");
      setOpenNewPassword(true);
      // localStorage.setItem('user', JSON.stringify(user));
      // console.log("Email:", user);
      // setDisplayPage('createProfile');
    }
  }, [isValidEmailOTP]);

  // useEffect(() => {
  //     const temp = localStorage.getItem('user');
  //     console.log(temp);
  // }, []);

  useEffect(() => {
    // console.log(verifyForgotEmailOTPError);
    if (verifyForgotEmailOTPError) {
      setIsValidEmailOTP(false);
      setOtpInputColor("error"); //false
      // console.log('fails');
      setErrorVerifyingOTP(true);
    } else {
      if (emailOTPSent && !isVerifyingForgotEmailOTP) {
        setIsValidEmailOTP(true);
        dispatch(userEmail(resendEmail));
      }
      // setErrorVerifyingOTP(false);
    }
  }, [isVerifyingForgotEmailOTP]);

  return (
    <div className={classes.emailVerificationCard}>
      <div className={classes.emailVerififcationTitle}>Email Verification</div>
      <div style={{marginBottom: '0.8em'}}>
      {errorGettingOTP && <ErrorInOTP message={getForgotEmailOTPErrorMsg || `A user with this email does not exist.`} />}
      {errorVerifyingOTP && (
        <ErrorInOTP message={verifyForgotEmailOTPErrorMsg || `A user with this email does not exist.`} /> 
       )}
      </div>
      {emailOTPSent && (
        <EmailVerificatonLinkSent
          email={resendEmail}
          handleGetOTP={handleGetOTP}
          disableResendButton={disableResendButton}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className={classes.emailVerififcationVerifySection}>
          <div className={classes.emailVerificationInput}>
            <BlueTextField
              variant="outlined"
              inputProps={{
                style: {
                  fontFamily: "Poppins",
                  fontSize: "14px",
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: "500",
                },
              }}
              color={emailInputColor}
              label="Enter Email Address"
              fullWidth
              type="email"
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGetOTP(email);
                }
              }}
              onChange={(e) => {
                setDisableButton(false);
                setEmail(e.target.value);
              }}
              disabled={isGettingForgotEmailOTP || isVerifyingForgotEmailOTP}
              // margin="normal"
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
                  "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
              }}
              onClick={() => handleGetOTP(email)}
              disabled={isGettingForgotEmailOTP || isVerifyingForgotEmailOTP}
            >
              {isGettingForgotEmailOTP ? (
                <CircularProgress size={20} style={{ color: "white" }} />
              ) : (
                `Get OTP`
              )}
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
                  "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
              }}
              disabled={true}
            >
              Get OTP
            </Button>
          )}
        </div>
        <BlueTextField
          label="Enter Verification Code"
          InputLabelProps={{
            style: {
              fontFamily: "Poppins",
              fontSize: "16px",
              fontWeight: "500",
            },
          }}
          variant="outlined"
          color={otpInputColor}
          fullWidth
          required
          onChange={(e) => {
            if (e.target.value.length > 6) {
              e.target.value = e.target.value.slice(0, 6);
            }
            setEmailOTP(e.target.value);
          }}
          margin="normal"
          disabled={
            !emailOTPSent ||
            isGettingForgotEmailOTP ||
            isVerifyingForgotEmailOTP
          }
        />
        <button
          className={
            !emailOTPSent || isVerifyingForgotEmailOTP
              ? classes.nextButtonDisabled
              : classes.nextButton
          }
          type="submit"
          disabled={!emailOTPSent || isVerifyingForgotEmailOTP}
        >
          {isVerifyingForgotEmailOTP && (
            <CircularProgress size={20} style={{ color: "black" }} />
          )}
          {!isVerifyingForgotEmailOTP && "Next"}
        </button>
      </form>
    </div>
  );
};

const EmailVerificatonLinkSent = ({
  email,
  handleGetOTP,
  disableResendButton,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.emailVerificationLinkSent}>
      <div className={classes.emailVerificationLinkSentMsg}>
        We have sent a verification code to this email.
      </div>
      <div>
        {!disableResendButton ? (
          <Button
            onClick={() => handleGetOTP(email)}
            sx={{
              "&.MuiButton-text": { color: "black" },
              height: "1.5em",
              width: "10px",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "0.9em",
              textTransform: "capitalize",
              textDecoration: "underline",

              borderRadius: "0px",
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
  emailVerificationCard: {
    backgroundColor: "white",
    minHeight: "fit-content",
    width: "30em",
    // width: '25%',
    padding: "0.9em",
    // minWidth: '300px',
    ["@media (max-width:720px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginTop: "3em",
      minWidth: "0px",
    },
  },

  emailVerififcationTitle: {
    fontFamily: "Merriweather",
    color: "#0A2B98",
    fontWeight: "700",
    fontSize: "1.6em",
    marginBottom: "1.1emem",
    paddingBottom: "4%",
    ["@media (max-width:720px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "100%",
      display: "flex",
      alignItems: "flex-start",
    },
  },

  emailVerififcationVerifySection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderRadius: "10px",
  },

  emailVerificationInput: {
    width: "70%",
    marginRight: "1em",
    borderRadius: "10px",
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

  emailVerificationLinkSent: {
    display: "flex",
    backgroundColor: "#FFDC9A",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "0.8em 0 0.8em 0",
    marginBottom: "2em",
  },

  emailVerificationLinkSentMsg: {
    width: "fit-content",
    marginLeft: "1em",
  },

  emailVerificationLinkSentResend: {
    color: "black",
    borderBottom: "1px solid black",
    cursor: "pointer",
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

export default ForgotPasswordEmail;
