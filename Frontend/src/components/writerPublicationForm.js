import { Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
// import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { PublicationTextField } from "../utils/common";
import { getAuthToken } from "../containers/common/commonFunctions";
// import axios from "axios";
// import { baseURL, endPoints } from "../utils/apiEndPoints";
import { useDispatch, useSelector } from "react-redux";
import { createPublications } from "../containers/writerContent/writerActions";

const WriterPublicationForm = ({ closeModal }) => {
  const classes = useStyles();
  const [image, setImage] = useState();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState();
  const [publicationName, setPublicationName] = useState("");
  const [isCreatingPublication, setIsCreatingPublication] = useState(false);
  const [publicationNameValidation, setPublicationNameValidation] = useState("");
  const fileInputRef = useRef();
  const { userUserName } = useSelector(state => ({
    userUserName: state.user.userUserName
  }));

  const onFileUpload = event => {
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

  const createPublication = async e => {
    setIsCreatingPublication(true);
    if (
      publicationName.trim().length < 3 ||
      publicationName.trim().length > 30
    ) {
      setPublicationNameValidation(
        "Ideally, your publication should be 3-30 characters long."
      );
      setIsCreatingPublication(false);
      return;
    }

    setPublicationNameValidation("");

    const fd = new FormData();
    if (image) {
      fd.append("image", image, image.name);
    }

    const token = getAuthToken();

    dispatch(
      createPublications({
        token,
        fd,
        userUserName,
        name: publicationName.trim()
      })
    );
    setIsCreatingPublication(false);
    closeModal();
  };

  return (
    <div className={classes.publishForm}>
      <h1 className={classes.heading}> Create Publication </h1>
      <Box className={classes.fileUpload}>
        {!imagePreview ? (
          <>
            <Button
              component="label"
              sx={{
                "&.MuiButton-text": { color: "#636363" },
                fontFamily: "Poppins",
                fontSize: "0.8em",
                textTransform: "capitalize",
                borderRadius: "10px",
                border: "2px solid #979797"
              }}
              style={{ width: "8rem", height: "34px" }}
            >
              <h3> +Add Logo </h3>{" "}
              <input
                required
                accept="image/*"
                type="file"
                hidden
                ref={fileInputRef}
                onChange={onFileUpload}
              />
            </Button>
            <div className={classes.imageSize}>250 x 250 pixels</div>
          </>
        ) : (
          <img
            height={250}
            width={250}
            style={{ objectFit: "cover" }}
            src={imagePreview}
            alt="aboutPublication"
          />
        )}
      </Box>
      <div classes={classes.textFieldContainer}>
        <PublicationTextField
          fullWidth
          required
          error={publicationNameValidation ? true : false}
          label="Publication Name"
          helperText={publicationNameValidation}
          inputProps={{
            style: {
              fontFamily: "Poppins",
              color: "#636363",
              fontSize: "14px",
              height: "15px",
              maxLength: 30
            }
          }}
          InputLabelProps={{
            style: { fontFamily: "Poppins", fontSize: "14px" }
          }}
          value={publicationName}
          onChange={e => setPublicationName(e.target.value.substring(0, 31))}
          style={{ width: "351px" }}
        />
      </div>
      <Box marginTop="15px">
        <Button
          onClick={createPublication}
          sx={{
            "&.MuiButton-text": { color: "white" },
            fontFamily: "Poppins",
            fontSize: "0.8em",
            textTransform: "capitalize",
            borderRadius: "10px",
            background:
              "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)"
          }}
          style={{ marginRight: "1rem", width: "8rem", height: "38px" }}
        >
          {isCreatingPublication && (
            <CircularProgress size={20} style={{ color: "white" }} />
          )}
          {!isCreatingPublication && <h3> Save</h3>}
        </Button>
        <Button
          onClick={() => closeModal()}
          sx={{
            "&.MuiButton-text": { color: "black" },
            fontFamily: "Poppins",
            fontSize: "0.8em",
            textTransform: "capitalize",
            borderRadius: "10px",
            border: "2px solid #979797"
          }}
          style={{ width: "8rem", height: "38px" }}
        >
          <h3>Cancel</h3>
        </Button>
      </Box>
    </div>
  );
};

const useStyles = makeStyles({
  heading: {
    color: "#636363",
    fontSize: "1.4rem",
    alignSelf: "flex-start",
    marginBottom: "0px"
  },

  fileUpload: {
    background: "#D4E5DD",
    width: "238px",
    display: "flex",
    color: "#636363",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "238px",
    marginBottom: "18px",
    borderRadius: "8px"
  },

  publishForm: {
    padding: "1.7rem",
    display: "flex",
    gap: "15px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  },

  textFieldContainer: {
    marginBottom: "16px"
  },

  imageSize: {
    color: "#636363",
    fontSize: "0.8rem",
    marginTop: "5px"
  },

  editAboutPage: {
    color: "#636363",
    alignSelf: "flex-start",
    fontSize: "0.8rem",
    marginBottom: "16px",
    marginLeft: "13.54%",
    cursor: "pointer"
  }
});
export default WriterPublicationForm;
