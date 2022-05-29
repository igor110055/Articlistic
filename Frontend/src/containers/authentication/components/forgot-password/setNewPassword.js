import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../primary-button/button";
import Input from "../primary-input/input";
import PrimaryError from "../primary-error/primaryError";
import { validatePassword } from "../../../../utils/common";
import { resetPassword } from "../../signupActions";
function SetNewPassword({ setDisplayPage }) {
  const dispatch = useDispatch();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [validPass, setValidPass] = useState(true);
  const [samePass, setSamePass] = useState(true);
  const { resetPasswordSuccess, resetPasswordError } = useSelector((state) => ({
    resetPasswordSuccess: state.signupReducer.resetPasswordSuccess,
    resetPasswordError: state.signupReducer.resetPasswordError,
  }));

  const handleReset = () => {
    if (!validatePassword(newPass)) {
      setValidPass(false);
      setSamePass(true);
      return;
    } else if (newPass !== confirmPass) {
      setValidPass(true);
      setSamePass(false);
      return;
    } else {
      const email = localStorage.getItem("forgotPasswordEmail");
      const id = localStorage.getItem("forgotPasswordUserId");
      dispatch(resetPassword({ email: email, newPassword: newPass, id: id }));
    }
  };

  useEffect(() => {
    if (resetPasswordSuccess && !resetPasswordError) {
      localStorage.removeItem("forgotPasswordEmail");
      localStorage.removeItem("forgotPasswordUserId");

      setDisplayPage("sign-in");
    } else if (resetPasswordError) {
      localStorage.removeItem("forgotPasswordUserId");
      localStorage.removeItem("forgotPasswordEmail");

      setDisplayPage("sign-in");
    }
  }, [resetPasswordSuccess, resetPasswordError]);

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
        <Input
          type={"password"}
          labelName={"New Password"}
          inputBorderColor={!validPass ? "#EB4335" : "#777983"}
          labelColor={!validPass ? "#EB4335" : "#777983"}
          onChange={setNewPass}
        />
        {!validPass && <PrimaryError message={"Use a strong password"} />}
        <Input
          type={"password"}
          inputBorderColor={!samePass ? "#EB4335" : "#777983"}
          labelColor={!samePass ? "#EB4335" : "#777983"}
          labelName={"Confirm password"}
          onChange={setConfirmPass}
        />
        {!samePass && <PrimaryError message={"passwords do not match"} />}
        <Button blue text={"Reset Password"} callback={() => handleReset()} />
      </div>
    </div>
  );
}

export default SetNewPassword;
