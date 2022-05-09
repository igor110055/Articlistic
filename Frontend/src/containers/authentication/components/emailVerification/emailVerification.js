import { useState } from "react";
import "./emailVerification.css";
import { validateEmail } from "../../../../utils/common";
import { ReactComponent as OtherOptions } from "../../../../Images/VectorOtherOptions.svg";
import { ReactComponent as ErrorSvg } from "../../../../Images/VectorErrorAlert.svg";
import Button from "../primary-button/button";
import VerifyOtp from "../verifyOtp/verify-otp";
function EmailVerification({ setDisplayPage }) {
  const [email, setEmail] = useState("");
  const [validClick, setValidClick] = useState(true);
  const [displaySection, setDisplaySection] = useState("enterEmail");
  const handleContinue = () => {
    if (validateEmail(email)) {
      setValidClick(true);
      setDisplaySection("enterOTP");
    } else {
      setValidClick(false);
    }
  };

  return (
    <div>
      {displaySection === "enterEmail" && (
        <div className="sign-up-with-email-container">
          <h3 className="sign-up-with-email-header">Sign up with your email</h3>
          <div className="email-input-div">
            <label
              htmlFor="email"
              style={
                !validClick
                  ? {
                      color: "#EB4335",
                    }
                  : {}
              }
            >
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              style={
                !validClick
                  ? {
                      borderColor: "#EB4335",
                    }
                  : {}
              }
              onChange={(e) => setEmail(e.target.value)}
            />
            {!validClick && (
              <p className="wrong-email">
                <ErrorSvg /> <span>Please enter a valid email address</span>
              </p>
            )}
            <Button text="Continue" blue callback={handleContinue} />
          </div>
          <div className="other-options">
            <OtherOptions className="other-options-svg" />
            <p className="other-options-text">Other sign up options</p>
          </div>
        </div>
      )}

      {displaySection === "enterOTP" && (
        <div style={{ width: "100%" }}>
          <VerifyOtp setDisplayPage={setDisplayPage} />
        </div>
      )}
    </div>
  );
}

export default EmailVerification;
