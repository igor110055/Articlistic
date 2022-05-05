import { useState, useEffect } from "react";
import { ATextField } from "../../utils/common";
import { makeStyles } from "@mui/styles";
import { validatePassword } from "../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "./loginSignupAction";
import { CircularProgress } from "@mui/material";
import { showSnackbar } from "../common/commonActions";

const ConfirmNewPassword = ({
  setOpenNewPassword,
  typeForDialog,
  entityForDialog,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorInPassword, setErrorInPassword] = useState(false);
  const [passwordMatchesError, setPasswordMatchesError] = useState(false);
  const [resetError, setResetError] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const classes = useStyles();

  const { isResettingPassword, resetPasswordError } = useSelector((state) => ({
    isResettingPassword: state.loginSignup.isResettingPassword,
    resetPasswordError: state.loginSignup.resetPasswordError,
  }));
  useEffect(() => {
    if (confirmNewPassword === newPassword && newPassword.length >= 8) {
      setBtnDisabled(false);
    }
  }, [confirmNewPassword]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (resetError && submitClicked) {
      // console.log(resetError);
      dispatch(showSnackbar("Unable to update password", "error"));
      setOpenNewPassword(false);
      // setOpenNewPassword(false);
      // setResetError(false);
    }
  }, [resetError]);

  useEffect(() => {
    if (resetSuccess && submitClicked) {
      dispatch(showSnackbar("Password updated successfully", "success"));
      setOpenNewPassword(false);
      // setOpenNewPassword(false);
      // setResetSuccess(false);
    }
  }, [resetSuccess]);

  useEffect(() => {
    if (resetPasswordError) {
      setResetError(true);
    } else {
      if (!isResettingPassword && submitClicked) {
        setResetSuccess(true);
      } else {
        setResetSuccess(false);
      }
    }
  }, [isResettingPassword]);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    dispatch(
      resetPassword({
        type: typeForDialog,
        entity: entityForDialog,
        password: newPassword,
      })
    );
    setSubmitClicked(true);
  };

  useEffect(() => {
    if (validatePassword(newPassword)) {
      setErrorInPassword(false);
    } else {
      if (newPassword.length > 0) {
        setErrorInPassword(true);
      } else {
        setErrorInPassword(false);
      }
    }
  }, [newPassword]);

  useEffect(() => {
    if (newPassword === confirmNewPassword) {
      setPasswordMatchesError(false);
    } else {
      if (confirmNewPassword.length > 0) {
        setPasswordMatchesError(true);
      } else {
        setPasswordMatchesError(false);
      }
    }
  }, [confirmNewPassword]);
  // console.log(resetSuccess, resetError);

  return (
    <div className={classes.newPassword}>
      <div className={classes.enterNewPasswordTitle}>Enter new password</div>
      {/* {resetSuccess && <CustomizedSnackbars openSnackbar={resetSuccess} setOpenSnackbar={setResetSuccess} severity="success"/>} */}
      {/* {resetError && <CustomizedSnackbars openSnackbar={resetError} setOpenSnackbar={setResetError} severity="error" message="Error changing password"/>} */}
      <form onSubmit={handleUpdatePassword}>
        {!errorInPassword ? (
          <ATextField
            label="Enter New Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            inputProps={{ style: { fontFamily: "Poppins", color: "#636363" } }}
            InputLabelProps={{ style: { fontFamily: "Poppins" } }}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isResettingPassword}
          />
        ) : (
          <ATextField
            label="Enter New Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            inputProps={{ style: { fontFamily: "Poppins", color: "#636363" } }}
            InputLabelProps={{ style: { fontFamily: "Poppins" } }}
            error
            helperText="Password should contain 1 uppercase letter, 1 lowercase letter, 1 special character and 1 number. Minimum 8 characters."
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isResettingPassword}
          />
        )}
        {!passwordMatchesError ? (
          <ATextField
            label="Confirm New Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            inputProps={{ style: { fontFamily: "Poppins", color: "#636363" } }}
            InputLabelProps={{ style: { fontFamily: "Poppins" } }}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            disabled={errorInPassword || isResettingPassword}
          />
        ) : (
          <ATextField
            label="Confirm New Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            inputProps={{ style: { fontFamily: "Poppins", color: "#636363" } }}
            InputLabelProps={{ style: { fontFamily: "Poppins" } }}
            error
            helperText="The two passwords don't match."
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            disabled={errorInPassword || isResettingPassword}
          />
        )}

        <button
          className={
            passwordMatchesError ||
            errorInPassword ||
            isResettingPassword ||
            btnDisabled
              ? classes.nextButtonDisabled
              : classes.nextButton
          }
          type="submit"
          disabled={btnDisabled || isResettingPassword}
        >
          {isResettingPassword && (
            <CircularProgress size={20} style={{ color: "black" }} />
          )}
          Update Password
        </button>
      </form>
    </div>
  );
};

const useStyles = makeStyles({
  newPassword: {
    padding: "2em",
  },

  success: {
    color: "green",
    textAlign: "center",
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
  failure: {
    color: "red",
    textAlign: "center",
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
});

export default ConfirmNewPassword;
