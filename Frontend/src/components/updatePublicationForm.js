import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
// import { Alert } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { PublicationTextField } from "../utils/common";
import { getAuthToken } from "../containers/common/commonFunctions";
// import axios from "axios";
// import { baseURL, endPoints } from "../utils/apiEndPoints";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePublication,
  deletePublication
} from "../containers/writerContent/writerActions";
import { useNavigate } from "react-router-dom";

import "./updatePublicationForm.css";
const UpdatePublicationForm = ({ closeModal, publication }) => {
  const classes = useStyles();
  const [image, setImage] = useState();
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState();
  const navigate = useNavigate();
  const [publicationNameValidation, setPublicationNameValidation] = useState(
    ""
  );
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const fileInputRef = useRef();
  const { publicationId, publicationName } = publication;
  const [updatedPublicationName, setUpdatedPublicationName] = useState(
    publicationName
  );
  const { userUserName } = useSelector(state => ({
    userUserName: state.user.userUserName
  }));

  const handlePublicationDelete = () => {
    const token = getAuthToken();
    dispatch(
      deletePublication({
        token,
        publicationId
      })
    );
    handleCloseModal();
    closeModal();
  };

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

  const onUpdatePublication = async e => {
    if (
      updatedPublicationName.trim().length < 3 ||
      updatedPublicationName.trim().length > 30
    ) {
      setPublicationNameValidation(
        "Ideally, your publication should be 3-30 characters long."
      );
      return;
    }

    setPublicationNameValidation("");

    const fd = new FormData();
    if (image) {
      fd.append("image", image, image.name);
    }

    const token = getAuthToken();

    dispatch(
      updatePublication({
        token,
        fd,
        userUserName,
        name: updatedPublicationName.trim(),
        publicationId
      })
    );

    closeModal();
  };

  return (
    <div className={classes.publishForm}>
      <div className="title-container">
        <h1 className={classes.heading}> Update Publication </h1>
        <div onClick={handleOpen} className="delete-button-container">
          <button className="delete-publication-button">
            <div className="delete_publication-svg">
              <svg
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.5504 10.9988C20.5504 16.5318 16.065 21.0172 10.532 21.0172C4.99904 21.0172 0.513672 16.5318 0.513672 10.9988C0.513672 5.46584 4.99904 0.980469 10.532 0.980469C16.065 0.980469 20.5504 5.46584 20.5504 10.9988ZM10.6008 10.1283L14.723 6.00617L16.1372 7.42039L12.015 11.5425L15.5937 15.1212L14.1795 16.5354L10.6008 12.9567L6.95349 16.6039L5.53929 15.1897L9.18658 11.5425L4.99588 7.35178L6.41009 5.93756L10.6008 10.1283Z"
                  fill="#F38484"
                />
              </svg>
            </div>
            <span className="delete-publication-span">Delete</span>
          </button>
        </div>
      </div>
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
                border: "2px solid #979797",
                backgroundColor: "#FFFFFF"
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
            alt="profile"
          />
        )}
      </Box>

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
        InputLabelProps={{ style: { fontFamily: "Poppins", fontSize: "14px" } }}
        value={updatedPublicationName}
        onChange={e =>
          setUpdatedPublicationName(e.target.value.substring(0, 31))
        }
        style={{ width: "351px" }}
      />
      <div>
        <div
          onClick={() => {
            navigate("/publication/edit", { state: publication });
          }}
          className="edit-about-page-button-container"
        >
          <button className="edit-about-page-button">
            <div className="edit-about-page-svg">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.3003 20.04C15.8342 20.04 20.3203 15.5539 20.3203 10.02C20.3203 4.48611 15.8342 0 10.3003 0C4.76638 0 0.280273 4.48611 0.280273 10.02C0.280273 15.5539 4.76638 20.04 10.3003 20.04ZM14.3268 7.92767L8.56634 13.6881L6.76619 11.888L12.5267 6.12752L14.3268 7.92767ZM14.6873 7.5672L14.8673 7.38719C15.3644 6.89009 15.3644 6.08414 14.8673 5.58704C14.3702 5.08994 13.5642 5.08994 13.0671 5.58704L12.8871 5.76706L14.6873 7.5672ZM7.99612 14.0176L5.86653 14.5882L6.43715 12.4586L7.99612 14.0176Z"
                  fill="#636363"
                />
              </svg>
            </div>
            <span className="edit-about-page-button-span">Edit About Page</span>
          </button>
        </div>
      </div>
      <Box>
        <div className="save-publication-button-container">
          <Button
            onClick={onUpdatePublication}
            sx={{
              "&.MuiButton-text": { color: "white" },
              fontFamily: "Poppins",
              fontSize: "0.8em",
              textTransform: "capitalize",
              borderRadius: "10px",
              background:
                "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)"
            }}
            style={{ marginRight: "1rem", width: "10.5rem", height: "38px" }}
          >
            <h3>Save</h3>
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
            style={{ width: "10.5rem", height: "38px" }}
          >
            <h3>Cancel</h3>
          </Button>
        </div>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-box">
          <div className="box-container">
            <Typography id="modal-modal-title" sx={modalHeaderStyle}>
              Delete this Publication?
            </Typography>
            <div className="alert-underline"></div>
            <div className="alert-container">
              <div className="alert-svg">
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.7874 1.70071L17.2093 12.769C17.5664 13.3845 17.5664 14.1194 17.2093 14.7349C16.8521 15.3503 16.2125 15.7178 15.4983 15.7178H2.65457C1.94032 15.7178 1.30075 15.3503 0.943626 14.7348C0.5865 14.1194 0.5865 13.3845 0.943626 12.7689L7.3655 1.70071C7.72259 1.08526 8.36222 0.717773 9.07644 0.717773C9.79069 0.717773 10.4303 1.08526 10.7874 1.70071ZM15.4988 14.7383C15.8572 14.7383 16.1781 14.554 16.3573 14.2451C16.5365 13.9363 16.5365 13.5676 16.3573 13.2587L9.93543 2.19046C9.75626 1.88163 9.4353 1.69727 9.07696 1.69727C8.71858 1.69727 8.39765 1.88163 8.21848 2.19046L1.79654 13.2587C1.61737 13.5676 1.61737 13.9363 1.79654 14.2451C1.97571 14.554 2.29664 14.7383 2.65505 14.7383H15.4988Z"
                    fill="black"
                  />
                  <path
                    d="M8.5823 5.71777H9.57062V10.7178H8.5823V5.71777Z"
                    fill="black"
                  />
                  <path
                    d="M9.07646 11.7178C8.80398 11.7178 8.5823 11.9421 8.5823 12.2178C8.5823 12.4935 8.80398 12.7178 9.07646 12.7178C9.34891 12.7178 9.57062 12.4935 9.57062 12.2178C9.57062 11.9421 9.34894 11.7178 9.07646 11.7178Z"
                    fill="black"
                  />
                </svg>
              </div>
              The Publication will be permanently deleted in 24 hours.
            </div>
            <div className="button-container">
              <Button
                color="error"
                variant="outlined"
                onClick={handlePublicationDelete}
                sx={deleteButtonStyle}
              >
                <span className="delete-span">Delete</span>
              </Button>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                sx={cancelButtonStyle}
                // className="cancel-button"
              >
                <span className="cancel-span">Cancel</span>
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
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
    width: "230px",
    display: "flex",
    color: "#636363",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "230px",
    marginBottom: "28px",
    marginTop: "28px",
    borderRadius: "8px"
  },

  publishForm: {
    padding: "1.7rem",
    display: "flex",
    gap: "5px",
    height: "573px",
    // width: "518px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "3rem"
  },

  imageSize: {
    fontSize: "0.8rem",
    marginTop: "5px",
    lineHeight: "24px",
    fontFamily: "poppins",
    fontWeight: "500",
    color: "#636363",
    letterSpacing: "-0.0583333px"
  },

  editAboutPage: {
    color: "#636363",
    alignSelf: "flex-start",
    fontSize: "0.8rem",
    marginBottom: "5px",
    marginTop: "9px",
    marginLeft: "5.25%",
    cursor: "pointer"
  }
});

const style = {
  // padding: "10px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 564,
  background: "#FFFFFF",
  border: "1px solid #D3D3D3",
  boxSizing: "border-box",
  boxShadow: "0px 4px 10px -6px rgba(0, 0, 0, 0.25)",
  borderRadius: "20px"
};

const modalHeaderStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: "800",
  fontSize: "24px",
  lineHeight: "36px",
  /* identical to box height */
  letterSpacing: "-0.105151px",
  color: "#000000"
};

const deleteButtonStyle = {
  width: "235px",
  height: "50px",
  background: "linear-gradient(180deg, #F26A6A 0%, #D63B3B 100%)",
  borderRadius: "10px",
  textTransform: "none"
};

const cancelButtonStyle = [
  {
    width: "235px",
    height: "50px",
    background: "#FFFFFF",
    borderRadius: "10px",
    border: "2px solid #979797",
    color: "#000000",
    textTransform: "none"
  },
  theme => ({
    "&:hover": {
      border: "2px solid #979797"
    }
  })
];

export default UpdatePublicationForm;
