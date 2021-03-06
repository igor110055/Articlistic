import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Button, CircularProgress, Dialog } from "@mui/material";
import {
  getRefreshToken,
  logout,
} from "../containers/authentication/signupActions";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import {
  getAuthToken,
  getRefreshToken as getRefreshTok,
} from "../containers/common/commonFunctions";

const Auth = ({ setAlreadySignedIn }) => {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const {
    isLoggingOut,
    logoutError,
    user,
    isGettingRefreshToken,
    getRefreshTokenError,
    getRefreshTokenErrorMsg,
    getRefreshTokenResp,
  } = useSelector((state) => ({
    isLoggingOut: state.signupReducer.isLoggingOut,
    logoutError: state.signupReducer.logoutError,
    user: state.user,
    isGettingRefreshToken: state.signupReducer.isGettingRefreshToken,
    getRefreshTokenError: state.signupReducer.getRefreshTokenError,
    getRefreshTokenErrorMsg: state.signupReducer.getRefreshTokenErrorMsg,
    getRefreshTokenResp: state.signupReducer.getRefreshTokenResp,
  }));

  useEffect(() => {
    if (logoutError) {
      // console.log("Logout Error");
    } else {
      // console.log("Logout auth");
      if (!isLoggingOut && submitClicked) {
        Cookie.remove("accessToken");
        Cookie.remove("refreshToken");
        Cookie.remove("oneDayBeforeAccessToken");
        // localStorage.removeItem("user");
        localStorage.removeItem("categories");
        localStorage.clear();
        navigate("/login");
      } else {
        // console.log(isLoggingOut, submitClicked);
      }
    }
  }, [isLoggingOut]);
  // console.log(process.env);
  const handleSignout = () => {
    const temp = getRefreshTok();
    setSubmitClicked(true);
    dispatch(
      logout(
        {
          accessToken: temp,
          username: user.userUserName
        },
        temp
      )
    );
  };

  useEffect(() => {
    if (getRefreshTokenError) {
      setKeepSignedIn(false);
    } else {
      if (!isGettingRefreshToken && keepSignedIn) {
        const encAccessToken = getRefreshTokenResp.accessToken;
        Cookie.set("accessToken", encAccessToken, { expires: 7 });
        Cookie.set("oneDayBeforeAccessToken", encAccessToken, { expires: 6 });
        setAlreadySignedIn(true);
      }
    }
  }, [isGettingRefreshToken]);

  const handleKeepSignedIn = () => {
    const temp = getAuthToken();
    dispatch(getRefreshToken({}, temp));
    setKeepSignedIn(true);
  };
  return (
    <div>
      <Dialog
        open={true}
        classes={{
          paper: classes.dialogPaper
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            height: "max-content"
          }
        }}
      >
        <p className={classes.title}>Stay signed in? ?????????????</p>
        <div className={classes.signedInDialog}>
          <Button
            sx={{
              "&.MuiButton-text": { color: "white" },
              height: "4em",
              width: "25%",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "0.9em",
              textTransform: "capitalize",
              background:
                "linear-gradient(128.16deg, #0B3BDB 0%, #0016B1 90.57%)",
              borderRadius: "10px"
            }}
            disabled={isGettingRefreshToken || isLoggingOut}
            onClick={handleSignout}
          >
            {isLoggingOut ? (
              <CircularProgress style={{ color: "white" }} />
            ) : (
              `No`
            )}
          </Button>
          <Button
            sx={{
              "&.MuiButton-text": { color: "white" },
              height: "4em",
              width: "25%",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: "0.9em",
              textTransform: "capitalize",
              background:
                "linear-gradient(128.16deg, #0B3BDB 0%, #0016B1 90.57%)",
              borderRadius: "10px"
            }}
            disabled={isGettingRefreshToken || isLoggingOut}
            onClick={handleKeepSignedIn}
          >
            {isGettingRefreshToken ? (
              <CircularProgress style={{ color: "white" }} />
            ) : (
              `Yes`
            )}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles({
  homeContainer: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    minHeight: "(100vh - 4.4rem)",
    backgroundColor: "white",
    width: "100%",
    marginTop: "4.2rem"
  },
  title: {
    textAlign: "center",
    fontSize: "1.8em"
  },

  signedInDialog: {
    display: "flex",
    justifyContent: "space-between",
    padding: "3%"
  },
  dialogPaper: {
    // minHeight: "40vh",
    // maxHeight: "35vh",
    // minWidth: "30vw",
    // maxWidth: "30vw",
    height: "30em",
    width: "30em",
    padding: "1%"
  }
});

export default Auth;
