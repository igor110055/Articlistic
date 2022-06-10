import { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as GoogleLogo } from "../../../../Images/GoogleLogo.svg";
import Button from "../primary-button/button";
import { signupWithGoogleInit } from "../../signupActions";
import { GOOGLE_CLIENT_ID } from "../../../../utils/apiEndPoints";
import { userEmail, userPName, userUsername } from "../../../user/userActions";
function GoogleAuth({ isSignIn }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    googleSignupSuccess,
    googleSignInSuccess,
    googleSignUpData,
    googleSignInData,
  } = useSelector((state) => ({
    googleSignUpInit: state.signupReducer.googleSignUpInit,
    googleSignupFailure: state.signupReducer.googleSignupFailure,
    googleSignupSuccess: state.signupReducer.googleSignupSuccess,
    googleSignUpData: state.signupReducer.googleSignUpData,
    googleSignInData: state.signupReducer.googleSignInData,
    googleSignInSuccess: state.signupReducer.googleSignInSuccess,
  }));

  const handleGoogleLogin = async (googleData) => {
    localStorage.setItem("userEmail", googleData.profileObj.email);
    if(googleData.tokenId !== undefined && googleData.tokenId !== null)
      dispatch(signupWithGoogleInit(googleData.tokenId));
  };

  useEffect(() => {
    if (googleSignInSuccess) {
      const email = localStorage.getItem("userEmail");
      dispatch(userEmail(email));
      dispatch(userPName(googleSignInData.name));
      dispatch(userUsername(googleSignInData.username));
      localStorage.setItem(
        "user",
        JSON.stringify({
          userEmailID: email,
          userProfileName: googleSignInData.name,
          userUserName: googleSignInData.username,
        })
      );
      navigate("/homepage");
    }
  }, [googleSignInSuccess]);

  useEffect(() => {
    if (googleSignupSuccess) {
      localStorage.setItem("createUserId", googleSignUpData.id);
      if (
        googleSignUpData.id !== undefined &&
        googleSignUpData.id !== "undefined"
      )
        navigate("/signup");
    }
  }, [googleSignupSuccess]);


  const handleGoogleFailure = (error) => {
    console.error(error);
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
