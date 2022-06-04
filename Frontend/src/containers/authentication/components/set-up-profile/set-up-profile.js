import "./set-up-profile.css";
import Button from "../primary-button/button";
import { Select, MenuItem } from "@material-ui/core";
import { useEffect, useState } from "react";
import { countries } from "./countries";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Input from "../primary-input/input";
import { checkUsername, sendProfileInfoInit } from "../../signupActions";
import { validatePassword, validateUserName } from "../../../../utils/common";
import PrimaryError from "../primary-error/primaryError";
import Cookie from "js-cookie";
import left_img from "../../../../Images/background-left.svg";
import right_img from "../../../../Images/background-right.svg";
import { userUsername, userPName } from "../../../user/userActions";
function SetUpProfile({ setDisplayPage }) {
  const {
    isSendingProfileInfo,
    validUsername,
    checkUsernameError,
    sendProfileInfoError,
    profileInfoSuccess,
    sendProfileInfoResp,
  } = useSelector((state) => ({
    validUsername: state.signupReducer.validUsername,
    isSendingProfileInfo: state.signupReducer.isSendingProfileInfo,
    checkUsernameError: state.signupReducer.checkUsernameError,
    sendProfileInfoError: state.signupReducer.sendProfileInfoError,
    profileInfoSuccess: state.signupReducer.profileInfoSuccess,
    sendProfileInfoResp: state.signupReducer.sendProfileInfoResp,
    user: state.user,
  }));
  const dispatch = useDispatch();
  const [country, setCountry] = useState("India");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [validUserName, setValidUserName] = useState(true);
  const [hasFocus, setFocus] = useState(false);
  const [once, setOnce] = useState(false);
  useEffect(() => {
    if (!hasFocus) {
      if (userName !== "") {
        dispatch(checkUsername(userName));
      }
    }
  }, [hasFocus]);

  useEffect(() => {
    if (!setValidUserName || checkUsernameError) setValidUserName(false);
    else setValidUserName(true);
  }, [validUsername, checkUsernameError]);

  useEffect(() => {
    if (once) {
      if (validatePassword(password)) setValidPassword(true);
      else setValidPassword(false);
    }
  }, [password]);

  useEffect(() => {
    if (once) {
      if (profileInfoSuccess) {
        dispatch(userUsername(sendProfileInfoResp.username));
        dispatch(userPName(sendProfileInfoResp.name));
        Cookie.set("accessToken", sendProfileInfoResp.accessToken, {
          expires: 7,
        });
        Cookie.set("refreshToken", sendProfileInfoResp.refreshToken, {
          expires: 30,
        });
        Cookie.set("oneDayBeforeAccessToken", true, { expires: 6 });
        const email = localStorage.getItem("userEmail");
        const newUser = {
          userUserName: sendProfileInfoResp.username,
          userProfileName: sendProfileInfoResp.name,
          userEmail: email,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.removeItem("createUserId");
        setDisplayPage("pickFavouriteWriters");
      } else if (sendProfileInfoError) {
        localStorage.removeItem("email");

        setDisplayPage("");
      }
      localStorage.removeItem("createUserId");
    }
  }, [sendProfileInfoError, profileInfoSuccess]);
  const handleCreateAccount = () => {
    setOnce(true);

    if (!validUserName) return;
    if (!validateUserName(userName)) {
      setValidUserName(false);
      return;
    }

    if (!validatePassword(password)) {
      setValidPassword(false);
      return;
    }

    if (userName === "" || checkUsernameError || !validUserName) {
      setValidUserName(false);
      return;
    }

    const createUserId = localStorage.getItem("createUserId");
    if (!createUserId) {
      localStorage.removeItem("createUserId");
      setDisplayPage("");
    }
    const email = localStorage.getItem("userEmail");
    if (!email) {
      localStorage.removeItem("userEmail");
      setDisplayPage("");
    }

    dispatch(
      sendProfileInfoInit({
        email,
        name,
        password,
        username: userName,
        id: createUserId,
        isWriter: true,
        country: country,
        googleUser: false,
      })
    );
  };
  const BootstrapInput = styled(InputBase)(() => ({
    "&": {
      width: "100%",
      boxSizing: "border-box",
      marginTop: "4px",
      height: "3rem",
    },
    "label + &": {
      marginTop: "3px",
    },
    "& .MuiInputBase-input": {
      width: "100%",
      border: "1px solid #C4C4C4",
      borderRadius: "10px",

      padding: "10px 26px 10px 12px",
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  }));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="bubble_background_container">
        <img
          src={left_img}
          className="onboarding-bubble-image"
          alt="left-img"
        />
      </div>
      <div className="set-up-profile-container">
        <h3 className="set-up-profile-header">Set up your profile </h3>
        <p className="set-up-profile-subtitle">
          Almost there! finish creating your account to experience attentioun.
        </p>
        <form className="user-inputs">
          {/* <label>
          Name
          <input placeholder="Enter your name" />
        </label> */}
          <Input
            labelName={"Name"}
            placeholder={"Enter your name"}
            labelColor={"#777983"}
            onChange={setName}
            onfocus={() => {
              return;
            }}
          />
          <Input
            labelName={"Username"}
            placeholder={"Create a username"}
            labelColor={"#777983"}
            onChange={setUserName}
            onfocus={setFocus}
          />
          {!validUserName && (
            <PrimaryError message={"This username is already in use."} />
          )}
          <Input
            labelName={"Password"}
            placeholder={"Create a Password"}
            labelColor={"#777983"}
            type={"password"}
            onChange={setPassword}
            onfocus={() => {
              return;
            }}
          />
          {!validPassword && (
            <PrimaryError message={"create a strong password"} />
          )}
          <p className="password-constraints">
            Password should contain 1 uppercase letter, 1 lowercase letter, 1
            special character and 1 number. Minimum 8 characters.
          </p>
          {/* <label>
          Username
          <input placeholder="Create a username" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create a password" />
        </label> */}
          <label>
            Country
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={country}
              label="country"
              input={<BootstrapInput />}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            >
              {countries.map((curCountry, idx) => (
                <MenuItem key={idx} value={curCountry.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </label>
        </form>
        <Button
          text={"Create Account"}
          blue
          callback={handleCreateAccount}
          isDisabled={isSendingProfileInfo}
          type={"submit"}
        />
      </div>
      <div className="bubble_background_container">
        <img
          src={right_img}
          className="onboarding-bubble-image"
          alt="left-img"
        />
      </div>
    </div>
  );
}

export default SetUpProfile;
