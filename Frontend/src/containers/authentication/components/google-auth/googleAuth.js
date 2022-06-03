import { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as GoogleLogo } from "../../../../Images/GoogleLogo.svg";
import Button from "../primary-button/button";
import { signupWithGoogleInit } from "../../signupActions";
import { GOOGLE_CLIENT_ID } from "../../../../utils/apiEndPoints";
import { userEmail, userPName, userUsername } from "../../../user/userActions";
function GoogleAuth({ isSignIn, setDisplayPage }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isSendingLoginCred,
    isLoggedIn,
    loginResp,
    googleSignUpInit,
    googleSignupSuccess,
    googleSignupData,
    googleSignupFailure,
    googleSignInData,
  } = useSelector((state) => ({
    isLoggedIn: state.signupReducer.isLoggedin,
    isSendingLoginCred: state.signupReducer.isSendingLoginCred,
    loginResp: state.signupReducer.loginResp,
    googleSignUpInit: state.signupReducer.googleSignUpInit,
    googleSignupSuccess: state.signupReducer.googleSignupSuccess,
    googleSignupData: state.signupReducer.googleSignupData,
    googleSignupFailure: state.signupReducer.googleSignupFailure,
    googleSignInData: state.signupReducer.googleSignInData,
  }));

  const handleGoogleLogin = async (googleData) => {
    console.log(googleData);
    localStorage.setItem("userEmail", googleData.profileObj.email);
    dispatch(signupWithGoogleInit(googleData.tokenId));
  };

  useEffect(() => {
    if (isLoggedIn && !isSendingLoginCred) {
      dispatch(userEmail(loginResp.private.email));
      dispatch(userPName(loginResp.name));
      dispatch(userUsername(loginResp.username));
      localStorage.setItem(
        "user",
        JSON.stringify({
          userEmailID: googleSignInData.private.email,
          userProfileName: googleSignInData.name,
          userUserName: googleSignInData.username,
        })
      );
      navigate("/writerDashboard");
    }
  }, [isLoggedIn, isSendingLoginCred]);

  useEffect(() => {
    if (googleSignupSuccess) {
      localStorage.setItem("createUserId", googleSignupData.id);
      // dispatch(userEmail(email));
      setDisplayPage("setUpProfile");
    }
  }, [googleSignupSuccess]);

  const handleGoogleFailure = (error) => {
    alert(JSON.stringify(error));
  };

  return (
    <>
      <GoogleLogin
        clientId={GOOGLE_CLIENT_ID}
        // buttonText="Log in with Google"
        render={(renderProps) => (
          <Button
            callback={renderProps.onClick}
            text={isSignIn ? "Sign in with Google" : "Sign up with Google"}
            isSvg
            Svg={GoogleLogo}
            isDisabled={googleSignUpInit}
          />
        )}
        onSuccess={handleGoogleLogin}
        onFailure={handleGoogleFailure}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}

export default GoogleAuth;
