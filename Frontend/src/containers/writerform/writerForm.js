import { useEffect, useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { ReactComponent as Logo } from "../../Images/logo.svg";
import { ReactComponent as GoogleLogo } from "../../Images/GoogleLogo.svg";
import Button from "./components/primary-button/button";
import { ReactComponent as ErrorSvg } from "../../Images/VectorErrorAlert.svg";
import {
  validateEmail,
  validatePassword,
  validateUserName,
} from "../../utils/common";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "./components/primary-input/input";
import PrimaryError from "./components/primary-error/primaryError";
import { userEmail, userUsername, userPName } from "../user/userActions";
import "./writerForm.css";
import OnboardingNavbar from "../navbar/onBoardingNavbar";
import Cookie from "js-cookie";
import { submitinit } from "./writerformaction";
import Uploadbutton from "./components/uploadbutton/uploadbutton";
function WriterForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const [validCred, setValidCred] = useState(true);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [imagePreview, setImagePreview] = useState();
  const [image, setImage] = useState();
  const [country, setcountry] = useState("");
  const [username, setusername] = useState("");
  const [type, setType] = useState("username");
  const [displayPage, setDisplayPage] = useState("form");

  const handleSubmit = () => {
    if (validateEmail(email)) setType("email");
    else setType("username");

    if (!validatePassword(password) && email !== "") {
      setValidCred(false);
      return;
    }
    if (
      !image ||
      !validateUserName(username) ||
      name.length == 0 ||
      country.length == 0
    ) {
      setValidCred(false);
      return;
    }
    const fd = new FormData();
    if (image) {
      fd.append("image", image);
    }
    fd.append("email", email);
    fd.append("name", name);
    fd.append("username", username);
    fd.append("password", password);
    fd.append("country", country);
    dispatch(submitinit({ fd }));
    navigate("/login");
  };
  const onFileUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type.substr(0, 5) === "image" &&
      event.target.files[0].size / (1024 * 1024) <= 5
    ) {
      setImage(file);
    } else {
      setImage(null);
      alert(`Publication Image size should be less than 5mb`);
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  return (
    <div>
      <OnboardingNavbar />
      {displayPage === "form" && (
        <div className="form-container">
          <div className="form-section">
            <Logo className="attentioun-logo" />
            <p className="form-text">Writer Details</p>
            <h3 className="attentioun-header">Attentioun</h3>
          </div>

          <Uploadbutton
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            image={image}
            setImage={setImage}
            fileInputRef={fileInputRef}
            onFileUpload={onFileUpload}
          />
          <div className="form-buttons">
            <div className="email-form">
              {!validCred && (
                <PrimaryError
                  message={
                    "Some fields are missing."
                  }
                />
              )}

              <Input type={"text"} placeholder={"name"} onChange={setname} />
              <Input
                type="text"
                placeholder="username"
                onChange={setusername}
              />

              <Input
                type="password"
                placeholder="password"
                onChange={setpassword}
              />

              <Input type="email" placeholder="email" onChange={setemail} />
              <Input type="text" placeholder="country" onChange={setcountry} />
            </div>
          </div>
          <Button
            text="Submit"
            blue
            height="5rem"
            callback={() => handleSubmit()}
          />
        </div>
      )}
    </div>
  );
}

export default WriterForm;
