import { useState, useEffect } from "react";
import "./mobile-navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookie from "js-cookie";
import { logout } from "../authentication/signupActions";
import { getAuthToken } from "../common/commonFunctions";
import userImage from "./../../Images/user-image.png";

function MobileNavbar() {
  const navigate = useNavigate();

  const [openSignup, setOpenSignup] = useState(false);
  const isWriter = localStorage.getItem("isWriter");

  useEffect(() => {
    const ele = document.querySelector(".dropdown-content");
    if (!submitClicked) {
      if (openSignup) {
        ele.style = "display: block;";
      } else {
        ele.style = "display: none;";
      }
    }
  }, [openSignup]);

  const [submitClicked, setSubmitClicked] = useState(false);

  const { isLoggingOut, logoutError } = useSelector((state) => ({
    state: state,
    isLoggingOut: state.signupReducer.isLoggingOut,
    logoutError: state.signupReducer.logoutError,
    logoutSuccess: state.signupReducer.logoutSuccess,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (logoutError) {
      setSubmitClicked(false);
    } else {
      if (!isLoggingOut && submitClicked) {
        Cookie.remove("oneDayBeforeAccessToken");
        Cookie.remove("accessToken");
        Cookie.remove("refreshToken");
        localStorage.removeItem("user");
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [isLoggingOut]);

  const handleSignout = () => {
    const temp = getAuthToken();
    dispatch(
      logout(
        {
          accessToken: temp,
          username: JSON.parse(localStorage.getItem("user")).userUserName,
        },
        temp
      )
    );
    setSubmitClicked(true);
  };

  return (
    <>
      <div className="mobile-navbar-container">
        <div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.2 9.10335e-07H1.8C0.8073 9.10335e-07 0 0.804601 0 1.7928V12.6072C0 13.5954 0.8073 14.4 1.8 14.4H4.5V18L10.2159 14.4H16.2C17.1927 14.4 18 13.5954 18 12.6072V1.7928C17.9986 1.31651 17.8082 0.860247 17.4708 0.524135C17.1333 0.188023 16.6763 -0.000478003 16.2 9.10335e-07ZM10.8 9.9H4.5V8.1H10.8V9.9ZM13.5 6.3H4.5V4.5H13.5V6.3Z"
              fill="#6B6B6B"
            />
          </svg>
        </div>
        <div onClick={() => navigate("/wallet")}>
          <svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.8158 10.5C13.2263 10.5 13.5658 10.3583 13.8342 10.075C14.1026 9.79167 14.2368 9.43333 14.2368 9C14.2368 8.56667 14.1026 8.20833 13.8342 7.925C13.5658 7.64167 13.2263 7.5 12.8158 7.5C12.4053 7.5 12.0658 7.64167 11.7974 7.925C11.5289 8.20833 11.3947 8.56667 11.3947 9C11.3947 9.43333 11.5289 9.79167 11.7974 10.075C12.0658 10.3583 12.4053 10.5 12.8158 10.5ZM9.97368 14C9.45263 14 9.00674 13.8043 8.636 13.413C8.26463 13.021 8.07895 12.55 8.07895 12V6C8.07895 5.45 8.26463 4.979 8.636 4.587C9.00674 4.19567 9.45263 4 9.97368 4H16.6053C17.1263 4 17.5725 4.19567 17.9439 4.587C18.3146 4.979 18.5 5.45 18.5 6V12C18.5 12.55 18.3146 13.021 17.9439 13.413C17.5725 13.8043 17.1263 14 16.6053 14H9.97368ZM2.39474 18C1.87368 18 1.42747 17.8043 1.05611 17.413C0.685368 17.021 0.5 16.55 0.5 16V2C0.5 1.45 0.685368 0.979 1.05611 0.587C1.42747 0.195667 1.87368 0 2.39474 0H15.6579C16.1789 0 16.6252 0.195667 16.9965 0.587C17.3673 0.979 17.5526 1.45 17.5526 2H9.97368C8.85263 2 7.94095 2.37067 7.23863 3.112C6.53568 3.854 6.18421 4.81667 6.18421 6V12C6.18421 13.1833 6.53568 14.1457 7.23863 14.887C7.94095 15.629 8.85263 16 9.97368 16H17.5526C17.5526 16.55 17.3673 17.021 16.9965 17.413C16.6252 17.8043 16.1789 18 15.6579 18H2.39474Z"
              fill="#6B6B6B"
            />
          </svg>
        </div>
        <div onClick={() => navigate("/homepage")}>
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 17.5C1.45 17.5 0.979333 17.3043 0.588 16.913C0.196 16.521 0 16.05 0 15.5V6.5C0 6.18333 0.0709998 5.88333 0.213 5.6C0.354333 5.31667 0.55 5.08333 0.8 4.9L6.8 0.4C6.98333 0.266667 7.175 0.166667 7.375 0.0999999C7.575 0.0333332 7.78333 0 8 0C8.21667 0 8.425 0.0333332 8.625 0.0999999C8.825 0.166667 9.01667 0.266667 9.2 0.4L15.2 4.9C15.45 5.08333 15.646 5.31667 15.788 5.6C15.9293 5.88333 16 6.18333 16 6.5V15.5C16 16.05 15.8043 16.521 15.413 16.913C15.021 17.3043 14.55 17.5 14 17.5H10V10.5H6V17.5H2Z"
              fill="#3095FF"
            />
          </svg>
        </div>
        <div>
          <svg
            width="14"
            height="18"
            viewBox="0 0 14 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.5 17.4375V2.24999C0.5 1.65326 0.737052 1.08096 1.15901 0.659008C1.58096 0.237052 2.15326 0 2.74999 0L11.75 0C12.3467 0 12.919 0.237052 13.341 0.659008C13.7629 1.08096 14 1.65326 14 2.24999V17.4375C14 17.5351 13.9747 17.6312 13.9264 17.716C13.8781 17.8009 13.8085 17.8718 13.7245 17.9216C13.6405 17.9715 13.5449 17.9986 13.4472 18.0003C13.3496 18.002 13.2532 17.9782 13.1675 17.9313L7.24998 14.7026L1.3325 17.9313C1.24681 17.9782 1.15038 18.002 1.05272 18.0003C0.955051 17.9986 0.859512 17.9715 0.775503 17.9216C0.691493 17.8718 0.62191 17.8009 0.573602 17.716C0.525295 17.6312 0.499929 17.5351 0.5 17.4375ZM7.42998 4.61249C7.41354 4.57875 7.38794 4.55032 7.35611 4.53043C7.32429 4.51054 7.28751 4.49999 7.24998 4.49999C7.21245 4.49999 7.17568 4.51054 7.14385 4.53043C7.11202 4.55032 7.08643 4.57875 7.06998 4.61249L6.35673 6.05811C6.34246 6.08735 6.32127 6.11267 6.295 6.13189C6.26873 6.1511 6.23818 6.16361 6.20599 6.16836L4.60849 6.40011C4.57171 6.40569 4.53722 6.4214 4.50887 6.44549C4.48053 6.46957 4.45945 6.50108 4.448 6.53647C4.43655 6.57186 4.43519 6.60974 4.44406 6.64586C4.45294 6.68199 4.4717 6.71492 4.49824 6.74098L5.65249 7.86711C5.69974 7.91323 5.72111 7.9796 5.70986 8.04485L5.43874 9.6356C5.43262 9.67233 5.43687 9.71004 5.451 9.74449C5.46514 9.77894 5.4886 9.80877 5.51875 9.83062C5.5489 9.85248 5.58455 9.86549 5.62168 9.8682C5.65882 9.87091 5.69598 9.86322 5.72899 9.84597L7.15773 9.09448C7.18638 9.07949 7.21822 9.07167 7.25055 9.07167C7.28287 9.07167 7.31471 9.07949 7.34336 9.09448L8.7721 9.84597C8.80507 9.86291 8.8421 9.87036 8.87905 9.8675C8.91601 9.86464 8.95144 9.85157 8.98141 9.82977C9.01138 9.80796 9.03471 9.77826 9.0488 9.74398C9.06289 9.7097 9.0672 9.67218 9.06123 9.6356L8.78898 8.04373C8.78324 8.01176 8.78536 7.97888 8.79516 7.94791C8.80496 7.91694 8.82214 7.88882 8.84523 7.86598L10.0017 6.73986C10.0283 6.7138 10.047 6.68086 10.0559 6.64474C10.0648 6.60861 10.0634 6.57073 10.052 6.53534C10.0405 6.49995 10.0194 6.46845 9.99109 6.44436C9.96275 6.42028 9.92825 6.40456 9.89148 6.39898L8.29398 6.16723C8.26179 6.16249 8.23123 6.14997 8.20496 6.13076C8.1787 6.11155 8.15751 6.08623 8.14323 6.05698L7.42998 4.61249Z"
              fill="#6B6B6B"
            />
          </svg>
        </div>
        <div
          onClick={() => {
            openSignup ? setOpenSignup(false) : setOpenSignup(true);
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 0C10.1935 0 11.3381 0.474106 12.182 1.31802C13.0259 2.16193 13.5 3.30653 13.5 4.5C13.5 5.69347 13.0259 6.83807 12.182 7.68198C11.3381 8.52589 10.1935 9 9 9C7.80653 9 6.66193 8.52589 5.81802 7.68198C4.97411 6.83807 4.5 5.69347 4.5 4.5C4.5 3.30653 4.97411 2.16193 5.81802 1.31802C6.66193 0.474106 7.80653 0 9 0ZM9 11.25C13.9725 11.25 18 13.2638 18 15.75V18H0V15.75C0 13.2638 4.0275 11.25 9 11.25Z"
              fill="#6B6B6B"
            />
          </svg>
          {openSignup && (
            <div className="mobile-signout-container">
              <span
                className="mobile-signout-text"
                onClick={handleSignout}
                style={{ cursor: "pointer" }}
              >
                Signout
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileNavbar;
