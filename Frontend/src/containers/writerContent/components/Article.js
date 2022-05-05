import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getAuthToken } from "../../common/commonFunctions";
import { deleteArticleInit } from "./articleActions";
// import { styled } from "@mui/styles";
// import { TextField } from "@mui/material";
import "./Article.css";
import placeholderImage from "../../../Images/placeholder_image.png";

const Article = ({ data, filters }) => {
  const navigate = useNavigate();
  const { articleId } = data;
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const onMakeChanges = () => {
    localStorage.setItem("articleId", articleId);
    navigate("/story");
  };

  // const { thisState } = useSelector(state => ({
  //   thisState: state
  // }));
  const deleteArticle = () => {
    const token = getAuthToken();
    dispatch(
      deleteArticleInit({
        token,
        articleId,
        filters
      })
    );
    handleCloseModal();
    handleCloseMenu();
    // forceUpdate(articleId);
  };

  return (
    <div className="article-container">
      <div className="article-img-div">
        <img
          className="article-img"
          src={data.public.articlePic || placeholderImage}
          alt="article"
        />
      </div>
      <div className="detail-div">
        <div className="title">{data.public.title.substring(0, 120)}...</div>
        <div className="sub-title">{data.public.body.substring(0, 150)}...</div>
      </div>
      <div className="manage-btn-div">
        <div className="button-div">
          <button
            style={{ cursor: "pointer" }}
            onClick={onMakeChanges}
            className="manage-btn"
          >
            Make Changes
          </button>
          {/* <MoreVertIcon onClick={handleClick} /> */}
          <div className="menu-anchor" onClick={handleClick}>
            <svg
              width="5"
              height="21"
              viewBox="0 0 5 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0C3.88071 0 5 1.11929 5 2.5Z"
                fill="#979797"
              />
              <path
                d="M5 10.5C5 11.8807 3.88071 13 2.5 13C1.11929 13 0 11.8807 0 10.5C0 9.11929 1.11929 8 2.5 8C3.88071 8 5 9.11929 5 10.5Z"
                fill="#979797"
              />
              <path
                d="M5 18.5C5 19.8807 3.88071 21 2.5 21C1.11929 21 0 19.8807 0 18.5C0 17.1193 1.11929 16 2.5 16C3.88071 16 5 17.1193 5 18.5Z"
                fill="#979797"
              />
            </svg>
          </div>
          {/* styling for the MUI  menu item is slightly different than others ... Notice the .MuiList class*/}
          <Menu
            sx={{
              // ".MuiList-root": {
              //   border: "3px solid #D3D3D3",
              //   boxSizing: "border-box",
              //   boxShadow: "0px 4px 10px -6px rgba(0, 0, 0, 0.25)",
              //   borderRadius: "20px",
              //   backgroundColor: "#FFFFFF",
              //   font: "poppins"
              // },
              ".MuiPaper-root": {
                border: "1px solid #D3D3D3",
                boxSizing: "border-box",
                boxShadow: "0px 4px 10px -6px rgba(0, 0, 0, 0.25)",
                borderRadius: "14px",
                backgroundColor: "#FFFFFF",
                font: "poppins",
                width: "143px"
              }
            }}
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button"
            }}
          >
            <MenuItem
              sx={{ width: "100%", fontFamily: "poppins" }}
              onClick={handleOpen}
              className="menu-item"
            >
              <div className="menu-icon">
                <svg
                  width="14"
                  height="17"
                  viewBox="0 0 14 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.01159 0.959961C5.68269 0.959961 5.34643 1.07532 5.10835 1.3134C4.87027 1.55148 4.75491 1.88775 4.75491 2.21664V2.84498H0.984863V4.10167H1.6132V14.1551C1.6132 15.1884 2.4649 16.0401 3.49823 16.0401H11.0383C12.0716 16.0401 12.9233 15.1884 12.9233 14.1551V4.10167H13.5517V2.84498H9.78164V2.21664C9.78164 1.88775 9.66628 1.55148 9.42819 1.3134C9.19011 1.07532 8.85385 0.959961 8.52495 0.959961H6.01159ZM6.01159 2.21664H8.52495V2.84498H6.01159V2.21664ZM2.86989 4.10167H11.6667V14.1551C11.6667 14.5037 11.3869 14.7835 11.0383 14.7835H3.49823C3.14969 14.7835 2.86989 14.5037 2.86989 14.1551V4.10167ZM4.12657 5.98669V12.8984H5.38325V5.98669H4.12657ZM6.63993 5.98669V12.8984H7.89661V5.98669H6.63993ZM9.15329 5.98669V12.8984H10.41V5.98669H9.15329Z"
                    fill="black"
                  />
                </svg>
              </div>
              <span className="delete-menu-span">Delete</span>
            </MenuItem>
            <MenuItem
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                font: "poppins"
              }}
              className="menu-item"
            >
              <div className="menu-icon">
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.324 0.607422H12.2631C11.9698 0.607422 11.8229 0.938267 12.0303 1.13187L12.9814 2.01949L7.43118 7.19966L4.96675 4.89952C4.7905 4.73502 4.50478 4.73502 4.32853 4.89952L1.01549 7.99154C0.839237 8.15604 0.839237 8.42271 1.01549 8.58722L1.53637 9.07337C1.71263 9.23788 1.99834 9.23788 2.1746 9.07337L4.64756 6.76527L7.10821 9.06189C7.28447 9.22639 7.57018 9.22639 7.74644 9.06189L8.01131 8.81467C8.02493 8.80456 8.03921 8.79553 8.05184 8.78373L14.1403 3.10116L15.0913 3.98878C15.2987 4.18238 15.6532 4.0453 15.6532 3.77159V0.914679C15.6532 0.744968 15.5059 0.607422 15.324 0.607422Z"
                    fill="#979797"
                  />
                  <path
                    d="M11.6532 6.3972V13.9714C11.6532 14.2041 11.8552 14.3926 12.1045 14.3926H13.5457C13.795 14.3926 13.997 14.2041 13.997 13.9714V4.20964L11.6532 6.3972Z"
                    fill="#979797"
                  />
                  <path
                    d="M8.6154 9.23266V13.9714C8.6154 14.2041 8.81741 14.3926 9.0667 14.3926H10.5079C10.7572 14.3926 10.9592 14.2041 10.9592 13.9714V7.0451L8.6154 9.23266Z"
                    fill="#979797"
                  />
                  <path
                    d="M7.42741 9.8746C7.10953 9.8746 6.81085 9.75911 6.58602 9.54927L5.5774 8.60805V13.9714C5.5774 14.2041 5.77942 14.3926 6.0287 14.3926H7.46991C7.71919 14.3926 7.92121 14.2041 7.92121 13.9714V9.77366C7.7681 9.83906 7.60087 9.8746 7.42741 9.8746Z"
                    fill="#979797"
                  />
                  <path
                    d="M4.64756 7.74004L2.69696 9.5606C2.64805 9.60624 2.59504 9.64668 2.53957 9.68313V13.9714C2.53957 14.2041 2.74159 14.3926 2.99088 14.3926H4.43208C4.68137 14.3926 4.88339 14.2041 4.88339 13.9714V7.96014L4.64756 7.74004Z"
                    fill="#979797"
                  />
                </svg>
              </div>
              <span className="disabledButton">Analytics</span>
            </MenuItem>
          </Menu>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="modal-box">
              <div className="modal-box-container">
                <Typography id="modal-modal-title" sx={modalHeaderStyle}>
                  Delete this story?
                </Typography>
                <div className="alert-story-underline"></div>
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
                  <div className="alert-text">
                    The story will be permanently deleted in 6 hours.
                  </div>
                </div>
                <div className="button-container">
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={deleteArticle}
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
      </div>
    </div>
  );
};
export default Article;

const style = {
  // padding: "10px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 520,
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
  width: "210px",
  height: "50px",
  background: "linear-gradient(180deg, #F26A6A 0%, #D63B3B 100%)",
  borderRadius: "10px",
  font: "poppins",
  textTransform: "none"
};

const cancelButtonStyle = [
  {
    width: "210px",
    height: "50px",
    background: "#FFFFFF",
    borderRadius: "10px",
    border: "2px solid #979797",
    color: "#000000",
    font: "poppins",
    textTransform: "none"
  },
  theme => ({
    "&:hover": {
      border: "2px solid #979797"
    }
  })
];

// const otherStyles = makeStyles({
//   menuStyles: {
//     border: "1px solid #D3D3D3",
//     boxSizing: "border-box",
//     boxShadow: "0px 4px 10px -6px rgba(0, 0, 0, 0.25)",
//     bordeRadius: "14px",
//     font: "poppins"
//   }
// });
