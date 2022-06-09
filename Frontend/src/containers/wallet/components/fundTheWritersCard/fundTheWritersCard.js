import { useState } from "react";
import User1 from "../../../../Images/users/Alex Tenario.png";
import User2 from "../../../../Images/users/Amarachi.png";
import User3 from "../../../../Images/users/Chandrava.png";
import User4 from "../../../../Images/users/Dontae.png";
import User5 from "../../../../Images/users/Hu Hyon-Suk.png";

import "./fundTheWritersCard.css";

function FundTheWritersCard() {

  const writersData = [
    {
      profilePic: User1,
      profileName: "Alex Tenario",
      shortName: "Alex",
      profileLink: "#"
    },
    {
      profilePic: User2,
      profileName: "Amarachi",
      shortName: "Amarachi",
      profileLink: "#"
    },
    {
      profilePic: User3,
      profileName: "Chandrava",
      shortName: "Chandrava",
      profileLink: "#"
    },
    {
      profilePic: User4,
      profileName: "Dontae",
      shortName: "Dontae",
      profileLink: "#"
    },
    {
      profilePic: User5,
      profileName: "Hu Hyon-Suk",
      shortName: "Hyon-Suk",
      profileLink: "#"
    }
  ];

  const [addFundsActive, setFundsActive] = useState(false);
  const [amountValue, setAmountValue] = useState(0.0);

  const setAmount = e => {
    setAmountValue(e.target.value);
  };
  return (
    <div className="fund-the-writer-card-container">
      <div className="fund-the-writer-total-amount-container">
        <div className="fund-the-writer-total-amount-content">
          <div className="fund-the-writer-total-balance-text">
            Total Balance
          </div>
          <div className="fund-the-writer-total-balance-amount">₹450</div>
        </div>
      </div>
      <div className="fund-the-writers-tabs-container">
        <div className="fund-the-writers-tabs-buttons">
          <button
            className={`fund-the-writers-tab-passive-button ${
              addFundsActive ? "fund-the-writers-tab-active-button" : ""
            }`}
            onClick={() => setFundsActive(true)}
          >
            Add funds
          </button>
          <button
            className={`fund-the-writers-tab-passive-button ${
              !addFundsActive ? "fund-the-writers-tab-active-button" : ""
            }`}
            onClick={() => setFundsActive(false)}
          >
            Fund the writers
          </button>
        </div>
      </div>
      {!addFundsActive && (
        <div>
          <div className="fund-the-writers-tab-content">
            <p className="fund-the-writers-tab-amount">Amount</p>
            <input
              className="fund-the-writers-tab-amount-input"
              placeholder={`₹ ${amountValue}`}
            />

            <div className="fund-the-writers-tab-amount-buttons-container">
              <button
                className="fund-the-writers-tab-amount-button"
                value={100}
                onClick={setAmount}
              >
                ₹ 100
              </button>
              <button
                className="fund-the-writers-tab-amount-button"
                value={200}
                onClick={setAmount}
              >
                ₹ 200
              </button>
              <button
                className="fund-the-writers-tab-amount-button"
                value={500}
                onClick={setAmount}
              >
                ₹ 500
              </button>
              <button
                className="fund-the-writers-tab-amount-button"
                value={1000}
                onClick={setAmount}
              >
                ₹ 1000
              </button>
            </div>
          </div>
          <div className="fund-the-writers-tab-amount-separator" />
          <div className="fund-the-writers-tab-writer-section">
            <div className="fund-the-writers-tab-writer-text">Writer</div>
             <input
              className="fund-the-writers-tab-amount-input"
              placeholder="Search writer / ID"
            />

            <div className="fund-the-writers-tab-recent-writers-text">Recent writers</div>
            <div className="fund-the-writers-tab-recent-writers-profiles">
              {writersData.map(writer => (
                <div className="fund-the-writers-tab-recent-writers-profile">
                  <img src={writer.profilePic} alt="profile" className="fund-the-writers-tab-recent-writers-profile-image"/>
                  <p className="fund-the-writers-tab-recent-writers-profiles-name">{writer.shortName}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="separator-fund-the-writers-tab-recent-writers"></div>
          <button className="separator-fund-the-writers-tab-fund-button">Fund</button>
        </div>
      )}
    </div>
  );
}

export default FundTheWritersCard;
