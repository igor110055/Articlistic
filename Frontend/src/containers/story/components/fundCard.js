import "./fundCard.css";
import userImage from "../../../Images/user-image.png";
function FundCard({ writerName, setIsModalOpen }) {
  return (
    <div className="fundcard-container">
      <div className="writer-info-section">
        <div className="writer-pic-div">
          <img src={userImage} className="writer-display-icon" alt="profile" />
          <div className="writer-name-span">
            <span>To, </span>
            <span style={{ fontWeight: "600" }}> {writerName}</span>
          </div>
          <div className="selected-amount">₹500</div>
        </div>
      </div>
      <div className="separator-div"></div>
      <div className="fund-amount-section">
        <div className="amount-buttons-section">
          <div className="first-button-row">
            <button className="amount-button">₹30</button>
            <button className="amount-button">₹50</button>
            <button className="amount-button">₹100</button>
          </div>
          <div className="second-button-row">
            <button className="amount-button">₹500</button>
            <button className="amount-button">other</button>
          </div>
        </div>
        <input className="fund-amount-input" placeholder="Message" />
        <button className="fund-button" onClick={() => setIsModalOpen(true)}>
          Fund
        </button>
      </div>
    </div>
  );
}

export default FundCard;
