import "./set-up-profile.css";
import Button from "../primary-button/button";
import { Select, MenuItem } from "@material-ui/core";
import { useState } from "react";
import { countries } from "./countries";

import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

function SetUpProfile({ setDisplayPage }) {
  const handleCreateAccount = () => {
    setDisplayPage("pickFavouriteWriters");
  };
  const [country, setCountry] = useState("+91");

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
    <div className="set-up-profile-container">
      <h3 className="set-up-profile-header">Set up your profile </h3>
      <p className="set-up-profile-subtitle">
        Almost there! finish creating your account to experience attentioun.
      </p>
      <form className="user-inputs">
        <label>
          Name
          <input placeholder="Enter your name" />
        </label>
        <label>
          Username
          <input placeholder="Create a username" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create a password" />
        </label>
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
              console.log(e.target.value);
            }}
          >
            {countries.map((country, idx) => (
              <MenuItem key={idx} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </label>
      </form>

      <Button text={"Create Account"} blue callback={handleCreateAccount} />
    </div>
  );
}

export default SetUpProfile;
