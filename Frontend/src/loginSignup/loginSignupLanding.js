import "./loginSignupLanding.css";
import {
  Divider,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import {
  validatePhoneNumber,
  validateEmail,
  BlueTextField,
} from "../utils/common";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./loginSignupAction";
import ForgotPassword from "./forgotPassword";
import logo from "../../Images/logo.svg";
import text from "../../Images/attentioun_text.svg";
import ConfirmNewPassword from "./confirmNewPassword";
import { userEmail, userPhone, userUsername } from "../containers/user/userActions";
import CustomizedSnackbars from "../components/materialuiSnackbar";
import {Error as LoginError } from "./helper_functions/error";

const LoginSignupLanding = () => {
  const [isSupported, setisSupported] = useState(true);
  const [showError, setShowError] = useState(false);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("userName");
  const [typeChecked, setTypeChecked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewPassword, setOpenNewPassword] = useState(false);
  const [typeForDialog, setTypeForDialog] = useState("phone");
  const [entityForDialog, setEntityForDialog] = useState("");
  const [loginInitiate, setLoginInitiate] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(true);
  const [boxToBeOpened, setBoxToBeOpened] = useState("");
  const [LoginErrorMessage, setLoginErrorMessage] = useState("");
  const {
    loginError,
    isSendingLoginCred,
    loginResp,
    user,
  } = useSelector((state) => ({
    loginError: state.loginSignup.loginError,
    isSendingLoginCred: state.loginSignup.isSendingLoginCred,
    loginResp: state.loginSignup.loginResp,
    user: state.user,
  }));
  function fnBrowserDetect() {
    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "edge";
    } else {
      browserName = "No browser detection";
    }

    return browserName;
  }
  const dispatch = useDispatch();
  useEffect(() => {
    fnBrowserDetect() === "safari" || fnBrowserDetect() === "firefox"
      ? setisSupported(false)
      : setisSupported(true);
  }, []);
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginInitiate(false);
    setShowError(false);
    if (input === "") {
      setLoginErrorMessage("Please enter your username/email/phone.");
      setShowError(true);
    } else if (password === "") {
      setLoginErrorMessage("Please enter your password.");
      setShowError(true);
    } else {
      if (validatePhoneNumber(input)) {
        setType("phone");
      } else if (validateEmail(input)) {
        setType("email");
      } else {
        setType("username");
      }

      setTypeChecked(true);
    }
  };

  useEffect(() => {
    if (userSignedIn) {
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/writerDashboard"); // for writers
    }
  }, [userSignedIn]);

  useEffect(() => {
    if (loginError) {
      setTypeChecked(false);
      setUserSignedIn(false);
    } else {
      if (!isSendingLoginCred && loginInitiate) {
        dispatch(userEmail(loginResp.private.email));
        dispatch(userPhone(loginResp.private.phone));
        dispatch(userUsername(loginResp.username));
        setUserSignedIn(true);
        localStorage.setItem("categories", true);
      }
    }
  }, [isSendingLoginCred]);

  useEffect(() => {
    if (typeChecked) {
      var i = input;
      if (type === "phone") {
        if (i.slice(0, 3) === "+91") {
          i = i.slice(3);
        }
      }
      dispatch(
        login({
          entity: i,
          type: type,
          password: password,
        })
      );
      setLoginInitiate(true);
    }
  }, [typeChecked]);

  useEffect(() => {
    if (loginError) {
      setShowError(true);
      setLoginErrorMessage("Incorrect Username or Password");
    } else {
      setShowError(false);
    }
  }, [loginError]);

  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      {/* <TempNavbar /> */}
      <div className="landing-page-right">
        <Dialog
          open={!isSupported}
          classes={{
            paper: classes.dialogPaper,
          }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "10px",
              height: "max-content",
            },
          }}
          onClose={(e) => {
            e.preventDefault();
            return;
          }}
        >
          <p className="not-supported-text">
            We're working to bring the Attentioun experience to Safari and
            Firefox. Please try using Chrome, Edge or Brave 🦾🏗️
          </p>
        </Dialog>

        <div className="login-card">
          <div className="logo-card">
            <img src={logo} alt="logo" className="logo-img"></img>
          </div>
          <div className="logo-text-div">
            <img src={text} className="logo-text" alt="logo-text"/>
          </div>
          <div className="login-top-content">
            <div className="login-top-content-internal">
              {showError && <LoginError message={LoginErrorMessage} />}
              <div className={classes.dialogContainer}>
                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  classes={{
                    paper: classes.dialogPaper,
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: "10px",
                      height: "max-content",
                    },
                  }}
                >
                  <ForgotPassword
                    setOpenDialog={setOpenDialog}
                    setOpenNewPassword={setOpenNewPassword}
                    boxToBeOpened={boxToBeOpened}
                    setEntityForDialog={setEntityForDialog}
                    setTypeForDialog={setTypeForDialog}
                  />
                </Dialog>
                <Dialog
                  open={openNewPassword}
                  className={classes.dialog}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: "10px",
                      height: "max-content",
                    },
                  }}
                >
                  <ConfirmNewPassword
                    setOpenNewPassword={setOpenNewPassword}
                    typeForDialog={typeForDialog}
                    entityForDialog={entityForDialog}
                    setTypeForDialog={setTypeForDialog}
                  />
                </Dialog>
              </div>
              <form onSubmit={handleLogin}>
                <BlueTextField
                  fullWidth
                  label="Username/Email/Phone"
                  margin="normal"
                  inputProps={{
                    style: {
                      fontFamily: "Poppins",
                      color: "#636363",
                      fontSize: "14px",
                    },
                    className: classes.input_field,
                  }}
                  onChange={(e) => setInput(e.target.value)}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: "500",
                    },
                  }}
                  disabled={isSendingLoginCred}
                />
                <BlueTextField
                  label="Password"
                  fullWidth
                  type="password"
                  margin="normal"
                  inputProps={{
                    style: {
                      fontFamily: "Poppins",
                      color: "#636363",
                      fontSize: "14px",
                    },
                  }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: "500",
                    },
                  }}
                  disabled={isSendingLoginCred}
                />
                {forgotPasswordVisible ? (
                  <div
                    className="forgot-password"
                    onClick={() => setForgotPasswordVisible(false)}
                  >
                    Forgot Password?
                  </div>
                ) : (
                  <span></span>
                )}

                <Button
                  sx={{
                    "&.MuiButton-text": { color: "white" },
                    background:
                      "linear-gradient(136.66deg, #2B56FF -9.32%, #1395FD 95.4%)",
                    fontFamily: "Poppins",
                    padding: "2%",
                    marginTop: "5%",
                    color: "#666",
                    fontWeight: "700",
                    fontSize: "0.9em",
                    boxShadow: "0px 0px 0px",
                    textTransform: "capitalize",
                    borderRadius: "7px",
                    height: "2.6rem",
                  }}
                  disabled={isSendingLoginCred || openDialog || openNewPassword}
                  fullWidth
                  type="submit"
                >
                  {isSendingLoginCred && (
                    <CircularProgress size={20} style={{ color: "white" }} />
                  )}
                  {!isSendingLoginCred && "Login"}
                </Button>
              </form>
            </div>
          </div>
          {forgotPasswordVisible ? (
            <span></span>
          ) : (
            <div className="forgot-password-box">
              <p className="reset-password-text">Reset Password</p>
              <span className="verify-span">
                <button
                  className="verify-phone-text"
                  onClick={(e) => {
                    setBoxToBeOpened("Phone");
                    setOpenDialog(true);
                  }}
                >
                  Phone Number
                </button>
                <button
                  className="verify-email-text"
                  onClick={(e) => {
                    setBoxToBeOpened("Email");
                    setOpenDialog(true);
                  }}
                >
                  Email
                </button>
              </span>
            </div>
          )}
          <Divider className="divider" />
          <CustomizedSnackbars />
          <div className="login-bottom-content">
            <div>Don’t have any account yet?</div>
            <Button
              sx={{
                "&.MuiButton-text": { color: "#6B6B6B" },
                // border: "2px black solid",
                background: "#FFFFFF",
                fontFamily: "Poppins",
                padding: "2%",
                marginTop: "5%",
                border: "2px solid #6B6B6B",
                fontWeight: "700",
                fontSize: "0.9em",
                boxShadow: "0px 0px 0px",
                borderRadius: "7px",
                textTransform: "capitalize",
                height: "2.6rem",
                marginBottom: "2.6em",
              }}
              fullWidth
              disabled={isSendingLoginCred}
              onClick={() => {
                localStorage.setItem("displayPage", "mobileVerification");
                navigate("/signup");
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


const useStyles = makeStyles({

  dialog: {
    width: "100vw",
  },

  dialogPaper: {
    // minHeight: "40vh",
    // maxHeight: "35vh",
    // minWidth: "30vw",
    // maxWidth: "30vw",
    height: "fit-content",
    width: "fit-content",
    padding: "1%",
  },
  input_field: {
    borderRadius: "10px",
  },
  dialogContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  enterNewPasswordTitle: {
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
});

export default LoginSignupLanding;
