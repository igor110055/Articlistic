import React from "react";
import "./earningsCard.css";
function EarningsCard() {
  return (
    <div className="earnings-card">
      <div className="content">
        <div className="earnings-container">
          <div className="earning">
            <p className="earning-text">Earnings</p>
            <p className="earning-amount">₹450</p>
            <p className="credits-amount">450 credits</p>
          </div>
          <div className="earning">
            <p className="earning-text">Total Earnings</p>
            <p className="earning-amount">₹3,500</p>
            <p className="credits-amount">3500 credits</p>
          </div>
        </div>
        <button className="payout-button">Payout</button>
        <div className="earnings-separator"></div>
        <div className="add-payout-container">

        <button className="add-payout-details-button">
          Add Payout Details
        </button>
        </div>
      </div>
    </div>
  );
}

export default EarningsCard;
