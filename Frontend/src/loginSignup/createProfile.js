import { BlueTextField, validatePassword } from "../utils/common";
import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkUsername, sendProfileInfo } from "./loginSignupAction";
import { useSelector } from "react-redux";
import { userPassword, userPName, userUsername } from "../containers/user/userActions";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { Error as ServerError } from "./helper_functions/error";

const CreateProfile = ({ setDisplayPage }) => {
  const dispatch = useDispatch();
  const [profileName, setProfileName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorInPassword, setErrorInPassword] = useState(false);
  // const [passwordHelperText, setPasswordHelperText] = useState(false);
  const [userNameAlreadyTaken, setUserNameAlreadyTaken] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isDataValid, setIsDataValid] = useState(false);
  const [upload, setUpload] = useState(false);
  const [errorCreatingUser, setErrorCreatingUser] = useState(false);
  const [errorInUserName, setErrorInUserName] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);

  const classes = useStyles();
  const navigate = useNavigate();

  const {
    // checkUsernameResp,
    checkUsernameError,
    isCheckingUsername,
    user,
    userProfileName,
    userAccountPassword,
    userUserName,
    isSendingProfileInfo,
    sendProfileInfoError,
    sendProfileInfoErrorMsg,
    sendProfileInfoResp,
  } = useSelector((state) => {
    return {
      checkUsernameResp: state.loginSignup.checkUsernameResp,
      checkUsernameError: state.loginSignup.checkUsernameError,
      isCheckingUsername: state.loginSignup.isCheckingUsername,
      user: state.user,
      userProfileName: state.user.userProfileName,
      userAccountPassword: state.user.userAccountPassword,
      userUserName: state.user.userUserName,
      isSendingProfileInfo: state.loginSignup.isSendingProfileInfo,
      sendProfileInfoError: state.loginSignup.sendProfileInfoError,
      sendProfileInfoErrorMsg: state.loginSignup.sendProfileInfoErrorMsg,
      sendProfileInfoResp: state.loginSignup.sendProfileInfoResp,
    };
  });

  // console.log(sendProfileInfoResp);

  useEffect(() => {
    // console.log(isSendingProfileInfo, sendProfileInfoError);
    if (isSendingProfileInfo) {
      setUpload(true);
      // console.log('1');
    }

    if (sendProfileInfoError) {
      setErrorCreatingUser(true);
    }
    // console.log('ashgfajsgf');
    if (!isSendingProfileInfo && !sendProfileInfoError && upload) {
      
      // const encAccessToken = CryptoJS.AES.encrypt(sendProfileInfoResp.accessToken, 'secretKeyNotToBeShared').toString();
      // const encRefreshToken = CryptoJS.AES.encrypt(sendProfileInfoResp.refreshToken, 'secretKeyNotToBeShared').toString();
      Cookie.set("accessToken", sendProfileInfoResp.accessToken, {
        expires: 7,
      });
      Cookie.set("refreshToken", sendProfileInfoResp.refreshToken, {
        expires: 30,
      });
      Cookie.set("oneDayBeforeAccessToken", true, { expires: 6 });
      localStorage.setItem("user", JSON.stringify(user));
      // console.log("Email:", user);
      // setDisplayPage('mapWritersAndCategories'); //for writers
      navigate("/writerDashboard");
    }
  }, [isSendingProfileInfo]);

  // console.log(isSendingProfileInfo);

  useEffect(() => {
    if (isDataValid) {
      var phone = user.userPhoneNumber;
      var international = true;
      if (phone.slice(0, 3) === "+91") {
        phone = user.userPhoneNumber.slice(3);
        international = false;
      }
      dispatch(
        sendProfileInfo({
          name: userProfileName,
          username: userUserName,
          password: userAccountPassword,
          phone: phone,
          email: user.userEmailID,
          international: international,
        })
      );
      setIsDataValid(false);
    }
  }, [isDataValid]);

  useEffect(() => {
    setUserNameAlreadyTaken(false);
    // console.log(checkUsernameError);
    if (checkUsernameError) {
      setIsDataValid(false);
      setSubmitClicked(false);
      setUserNameAlreadyTaken(true);
    } else {
      if (validateUserName(userName)) {
        dispatch(userPName(profileName));
        dispatch(userUsername(userName));
        dispatch(userPassword(password));
        if (!isCheckingUsername && submitClicked) {
          setIsDataValid(true);
          setSubmitClicked(false);
          // console.log('b')
        }
      } else {
        setErrorInUserName(true);
      }
    }
  }, [isCheckingUsername]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    setErrorCreatingUser(false);

    dispatch(checkUsername(userName));
  };

  useEffect(() => {
    if (false) {
    } else {
      if (validatePassword(password)) {
        setErrorInPassword(false);
        setBtnDisabled(false);
      } else {
        if (password.length > 0) {
          setErrorInPassword(true);
        } else {
          setErrorInPassword(false);
        }
      }
    }
  }, [password]);

  const validateUserName = (uName) => {
    if (
      uName[uName.length - 1] !== "-" &&
      uName[0] !== "-" &&
      uName.length > 3 &&
      uName.length < 21
    ) {
      return true;
    }
    if (userNameAlreadyTaken) {
      setUserNameAlreadyTaken(false);
    }
    return false;
  };

  useEffect(() => {
    if (validateUserName(userName)) {
      setErrorInUserName(false);
    } else {
      if (userName.length > 0 || userName.length > 20) {
        setErrorInUserName(true);
      } else {
        setErrorInUserName(false);
      }
    }
  }, [userName]);
  return (
    <div className={classes.mobileVerifyDiv}>
      <div className={classes.createProfileCard}>
        <div className={classes.cardTitle}>Create Profile</div>
        {errorCreatingUser && <ServerError message={sendProfileInfoErrorMsg} />}
        <form onSubmit={handleSubmit}>
          <BlueTextField
            label="Profile Name"
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ style: { fontFamily: "Poppins", color: "#636363" } }}
            InputLabelProps={{
              style: {
                fontFamily: "Poppins",
                fontSize: "16px",
                fontWeight: "500",
              },
            }}
            onChange={(e) => setProfileName(e.target.value)}
            required
          />
          {!userNameAlreadyTaken ? (
            !errorInUserName ? (
              <BlueTextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                inputProps={{
                  style: { fontFamily: "Poppins", color: "#636363" },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontWeight: "500",
                  },
                }}
                onChange={(e) => {
                  setUserName(e.target.value.replace(/\s/g, ""));
                }}
                required
              />
            ) : (
              <BlueTextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                inputProps={{
                  style: { fontFamily: "Poppins", color: "#636363" },
                }}
                InputLabelProps={{
                  style: {
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontWeight: "500",
                  },
                }}
                onChange={(e) => setUserName(e.target.value.replace(/\s/g, ""))}
                error={errorInUserName}
                helperText="The username should be 3 to 20 characters and should not start or end with '-'. Allowed characters [0-9] [a-z] [A-Z] [-]"
                required
              />
            )
          ) : (
            <BlueTextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              inputProps={{
                style: { fontFamily: "Poppins", color: "#636363" },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins",
                  fontWeight: "500",
                },
              }}
              onChange={(e) => setUserName(e.target.value)}
              error={userNameAlreadyTaken}
              helperText="This username is already taken. Please try another one."
              required
            />
          )}
          {!errorInPassword ? (
            <BlueTextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              inputProps={{
                style: { fontFamily: "Poppins", color: "#636363" },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins",
                  fontWeight: "500",
                },
              }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          ) : (
            <BlueTextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              inputProps={{
                style: { fontFamily: "Poppins", color: "#636363" },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  color: "#7C7C7C",
                },
              }}
              error
              helperText="Password should contain 1 uppercase letter, 1 lowercase letter, 1 special character and 1 number. Minimum 8 characters."
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          <button
            className={
              errorInPassword ||
              isCheckingUsername ||
              isSendingProfileInfo ||
              errorInUserName ||
              btnDisabled
                ? classes.nextButtonDisabled
                : classes.nextButton
            }
            type="submit"
            disabled={
              errorInPassword ||
              isCheckingUsername ||
              isSendingProfileInfo ||
              btnDisabled ||
              errorInUserName
            }
          >
            {isSendingProfileInfo && (
              <CircularProgress size={20} style={{ color: "black" }} />
            )}
            {!isSendingProfileInfo && "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};


const useStyles = makeStyles({
  createProfileCard: {
    backgroundColor: "white",
    width: "29em",
    borderRadius: "10px",
    height: "fit-content",
    alignSelf: "center",
    padding: "2em",
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
      minWidth: "0px",
    },
    boxShadow: "20px 32px 64px 0px rgba(214, 230, 255, 0.5)",
  },

  cardTitle: {
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

  button: {
    "&:hover": {
      backgroundColor: "#fff",
      color: "#6B6B6B",
    },
    marginBottom: "2em",
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
    marginBottom: "1em",
    marginTop: "1em",
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
      color: "#6B6B6B",
    },
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
    marginBottom: "2em",
  },
  wrongOTPMsg: {
    width: "80%",
  },
  mobileVerifyDiv: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default CreateProfile;
