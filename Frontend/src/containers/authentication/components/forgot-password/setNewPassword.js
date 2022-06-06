import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../primary-button/button";
import Input from "../primary-input/input";
import PrimaryError from "../primary-error/primaryError";
import { validatePassword } from "../../../../utils/common";
import { resetPassword, resetPasswordState } from "../../signupActions";
import { showSnackbar } from "../../../common/commonActions";
import CustomizedSnackbars from "../../../../components/materialuiSnackbar";

function SetNewPassword({ setDisplayPage }) {
  const dispatch = useDispatch();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [validPass, setValidPass] = useState(true);
  const [samePass, setSamePass] = useState(true);
  const {
    resetPasswordSuccess,
    isResettingPassword,
    resetPasswordError,
    open,
    variant,
    message,
  } = useSelector((state) => ({
    resetPasswordSuccess: state.signupReducer.resetPasswordSuccess,
    isResettingPassword: state.signupReducer.isResettingPassword,
    resetPasswordError: state.signupReducer.resetPasswordError,
    variant: state.common.snackbar.variant,
    message: state.common.snackbar.message,
    open: state.common.snackbar.open,
  }));

  const handleReset = () => {
    if (!validatePassword(newPass)) {
      setValidPass(false);
      setSamePass(true);
    } else if (newPass !== confirmPass) {
      setValidPass(true);
      setSamePass(false);
    } else {
      const email = localStorage.getItem("forgotPasswordEmail");
      const id = localStorage.getItem("forgotPasswordUserId");
      dispatch(resetPassword({ email: email, newPassword: newPass, id: id }));
    }
  };

  useEffect(() => {
    if (resetPasswordSuccess) {
      dispatch(showSnackbar("Password updated successfully", "success"));
      setTimeout(() => {
        setDisplayPage("sign-in");
      }, 1000);

      localStorage.removeItem("forgotPasswordUserId");
      localStorage.removeItem("forgotPasswordEmail");
      setTimeout(() => {
        setDisplayPage("sign-in");
      }, 1000);
    }
  }, [resetPasswordSuccess]);

  useEffect(() => {
    if (resetPasswordError) {
      dispatch(
        showSnackbar(
          "Error occurred while updating password. Please try resetting passowrd again",
          "error"
        )
      );
      localStorage.removeItem("forgotPasswordUserId");
      localStorage.removeItem("forgotPasswordEmail");
      dispatch(resetPasswordState());
      setTimeout(() => {
        setDisplayPage("sign-in");
      }, 1000);
    }
  }, [resetPasswordError]);

  return (
    <div
      className="verify-otp-container"
      style={{ marginTop: "98px", paddingBottom: "97px" }}
    >
      <h3 className="verify-otp-header" style={{ margin: "0 0 12px 0" }}>
        Change Password
      </h3>
      <p
        className="verify-otp-subtitle"
        style={{ margin: 0 }}
      >{`Please enter a new password.`}</p>
      <div style={{ marginTop: "36px" }}>
        <form>
          <Input
            type={"password"}
            labelName={"New Password"}
            inputBorderColor={!validPass ? "#EB4335" : "#777983"}
            labelColor={!validPass ? "#EB4335" : "#777983"}
            onChange={setNewPass}
            onfocus={() => {
              return;
            }}
          />
          {!validPass && <PrimaryError message={"Use a strong password"} />}
          <p className="password-constraints">
            Password should contain 1 uppercase letter, 1 lowercase letter, 1
            special character and 1 number. Minimum 8 characters.
          </p>
          <Input
            type={"password"}
            inputBorderColor={!samePass ? "#EB4335" : "#777983"}
            labelColor={!samePass ? "#EB4335" : "#777983"}
            labelName={"Confirm password"}
            onChange={setConfirmPass}
            onfocus={() => {
              return;
            }}
          />
          {!samePass && <PrimaryError message={"passwords do not match"} />}
          <Button
            blue
            text={"Reset Password"}
            callback={() => handleReset()}
            isDisabled={isResettingPassword}
            type={"submit"}
          />
        </form>
      </div>
      <CustomizedSnackbars variant={variant} message={message} openS={open} />
    </div>
  );
}

export default SetNewPassword;
