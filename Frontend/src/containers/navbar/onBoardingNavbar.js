import React from "react";
import "./tempNavbar.css";
import hlogo from "./../../Images/horizontal (1).svg";

function OnBoardingNavbar() {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div>
      <div className="topnav" id="myTopnav">
        <a>
          <div className="nav-left">
            <div
              className="nav-logo"
              style={{ cursor: "pointer" }}
              onClick={refreshPage}
            >
              <img src={hlogo} alt="logo" className="nav-logo" />
            </div>
            {/* <div className="nav-search">
                        <img src={searchLogo} alt="search" />
                        <input type="text" placeholder="Search" />
                    </div> */}
          </div>
        </a>
      </div>
    </div>
  );
}

export default OnBoardingNavbar;
