import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { ReactComponent as GoogleLogo } from "../../../../Images/GoogleLogo.svg";
import Button from "../primary-button/button";
import { signupWithGoogleInit } from "../../signupActions";

function GoogleAuth({ isSignIn }) {
  const dispatch = useDispatch();

  const handleGoogleLogin = async (googleData) => {
    console.log(googleData);
    dispatch(signupWithGoogleInit(googleData.tokenId));
    //   const res = await fetch("/api/v1/auth/google", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       token: googleData.tokenId,
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const data = await res.json();
  };

  const handleGoogleFailure = (error) => {
    alert(JSON.stringify(error));
  };

  return (
    <>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        // buttonText="Log in with Google"
        render={({ onClick }) => (
          <Button
            text={isSignIn ? "Sign in with Google" : "Sign up with Google"}
            isSvg
            Svg={GoogleLogo}
            // callback={onClick}
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