import { Button, CircularProgress, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";
import { validateEmail } from "../utils/common";
import { useSelector, useDispatch } from "react-redux";
import { getEmailOTP, verifyEmailOTP } from "./loginSignupAction";
import { userEmail } from "../containers/user/userActions";
import { Timer } from "./Timer";
import { Error as ErrorInOTP } from "./helper_functions/error";

const EmailVerification = ({ setDisplayPage, displayPage }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [isValidEmailOTP, setIsValidEmailOTP] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [errorOccured, setErrorOccured] = useState(false);
  const [errorSendingOTP, setErrorSendingOTP] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [disableResendButton, setDisableResendButton] = useState(false);
  const [emailInputcolor, setEmailInputColor] = useState("primary");
  const [otpInputColor, setOtpInputColor] = useState("primary");

  const dispatch = useDispatch();

  let {
    isGettingEmailOTP,
    getEmailOTPError,
    getEmailOTPErrorMsg,
    isVerifyingEmailOTP,
    verifyEmailOTPError,
    verifyEmailOTPErrorMsg,
    user,
    // userEmailID,
  } = useSelector((state) => ({
    isGettingEmailOTP: state.loginSignup.isGettingEmailOTP,
    getEmailOTPError: state.loginSignup.getEmailOTPError,
    getEmailOTPErrorMsg: state.loginSignup.getEmailOTPErrorMsg,
    isVerifyingEmailOTP: state.loginSignup.isVerifyingEmailOTP,
    verifyEmailOTPError: state.loginSignup.verifyEmailOTPError,
    verifyEmailOTPErrorMsg: state.loginSignup.verifyEmailOTPErrorMsg,
    user: state.user,
    userEmailID: state.user.userEmailID,
  }));
  useEffect(() => {
    if (isValidEmail) setEmailInputColor("primary");
    else setEmailInputColor("error");
  }, [isValidEmail]);
  useEffect(() => {
    if (validateEmail(email)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  }, [email]);

  const handleGetOTP = (eml) => {
    setErrorOccured(false);
    setErrorSendingOTP(false);
    if (validateEmail(eml)) {
      setResendEmail(eml);
      dispatch(getEmailOTP(eml));
    }
  };

  useEffect(() => {
    if (getEmailOTPError) {
      setEmailOTPSent(false);
      setOtpInputColor("error");
      setErrorSendingOTP(true);
    } else {
      if (isValidEmail && !isGettingEmailOTP) {
        setEmailOTPSent(true);
        setDisableButton(true);
        setDisableButton(true);
        setDisableResendButton(true);
        setTimeout(() => {
          setDisableResendButton(false);
        }, 15000);
      }
    }
  }, [isGettingEmailOTP]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorOccured(false);
    setErrorSendingOTP(false);
    if (emailOTP.length === 6) {
      dispatch(verifyEmailOTP({ email: resendEmail, otp: emailOTP }));
    } else {
      verifyEmailOTPErrorMsg = "Verification Code must be of atleast 6 digits.";
      setErrorOccured(true);
    }
  };

  useEffect(() => {
    if (isValidEmailOTP && displayPage === "emailVerification") {
      // const tempUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem("user", JSON.stringify(user));
      // console.log("Email:", user);
      setDisplayPage("createProfile");
    }
  }, [isValidEmailOTP]);

  // useEffect(() => {
  //     const temp = localStorage.getItem('user');
  //     console.log(temp);
  // }, []);

  useEffect(() => {
    // console.log(verifyEmailOTPError);
    if (verifyEmailOTPError) {
      setIsValidEmailOTP(false); //false
      setOtpInputColor("error");
      // console.log('fails');
      setErrorOccured(true);
    } else {
      if (emailOTPSent && !isVerifyingEmailOTP) {
        setIsValidEmailOTP(true);
        dispatch(userEmail(resendEmail));
      } else {
        setIsValidEmailOTP(false);
      }
      setErrorOccured(false);
    }
  }, [isVerifyingEmailOTP]);

  return (
    <div className={classes.mobileVerifyDiv}>
      <div className={classes.emailVerificationCard}>
        <div className={classes.emailVerififcationTitle}>
          Email Verification
        </div>
        <div style={{marginTop: '0.8em', marginBottom: '0.8em'}}>
        {errorOccured && <ErrorInOTP message={verifyEmailOTPErrorMsg} />}
        {errorSendingOTP && <ErrorInOTP message={getEmailOTPErrorMsg} />}
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
              <TextField
                variant="outlined"
                label="Enter Email Address"
                className={classes.emailInput}
                sx={{
                  fieldset: {
                    borderRadius: "10px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontWeight: "500",
                    marginRight: "4px",
                  },
                }}
                type="email"
                color={emailInputcolor}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGetOTP(email);
                  }
                }}
                onChange={(e) => {
                  setDisableButton(false);
                  setEmail(e.target.value);
                }}
                disabled={isGettingEmailOTP || isVerifyingEmailOTP}
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
                disabled={
                  !isValidEmail ||
                  isGettingEmailOTP ||
                  isVerifyingEmailOTP ||
                  disableButton
                }
              >
                {isGettingEmailOTP && (
                  <CircularProgress size={20} style={{ color: "white" }} />
                )}
                {!isGettingEmailOTP && "Get OTP"}
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
          <TextField
            label="Enter Verification Code"
            fullWidth
            sx={{
              fieldset: {
                borderRadius: "10px",
              },
            }}
            variant="outlined"
            color={otpInputColor}
            InputLabelProps={{
              style: {
                fontFamily: "Poppins",
                fontSize: "16px",
                fontWeight: "500",
              },
            }}
            onChange={(e) => {
              if (e.target.value.length > 6) {
                e.target.value = e.target.value.slice(0, 6);
              }
              setEmailOTP(e.target.value);
            }}
            margin="normal"
            disabled={!emailOTPSent || isGettingEmailOTP || isVerifyingEmailOTP}
          />
          <button
            className={
              !emailOTPSent || isVerifyingEmailOTP
                ? classes.nextButtonDisabled
                : classes.nextButton
            }
            type="submit"
            disabled={!emailOTPSent || isVerifyingEmailOTP}
          >
            {isVerifyingEmailOTP && (
              <CircularProgress size={20} style={{ color: "black" }} />
            )}
            {!isVerifyingEmailOTP && "Next"}
          </button>
        </form>
      </div>
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
              marginRight: "2em",
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
    width: "29em",
    borderRadius: "10px",
    padding: "2em 2em 0 2em",
    height: "fit-content",
    minWidth: "30em",
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
    boxShadow: "20px 32px 64px 0px rgba(214, 230, 255, 0.5)",
  },

  emailVerififcationTitle: {
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

  emailVerififcationVerifySection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  emailInput: {
    width: "20em",
  },
  emailVerificationInput: {
    width: "70%",
  },

  emailVerificationLinkSent: {
    display: "flex",
    backgroundColor: "#FFDC9A",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "0.7em 0 0.7em 0",
    marginBottom: "1.8em",
    justifyContent: "space-between",
  },

  emailVerificationLinkSentMsg: {
    width: "fit-content",
    marginLeft: "2em",
  },

  emailVerificationLinkSentResend: {
    color: "black",
    borderBottom: "1px solid black",
    cursor: "pointer",
  },
  mobileVerifyDiv: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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

    marginBottom: "2.5em",
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
    marginBottom: "2.5em",
    textDecoration: "bold",
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
    paddingLeft: "3em",
  },

  successfullOTPSentResend: {
    color: "black",
    outline: "none",
    border: "none",
    backgroundColor: "transparent",
    textDecoration: "underline",

    paddingLeft: "3em",
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

export default EmailVerification;
