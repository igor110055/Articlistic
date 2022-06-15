import userImage from "../../../Images/user-image.png";
import "./nextFunderCard.css";
function NextFunderCard({ name, amount }) {
  return (
    <div className="next-funder-container">
      <div className="next-funder-profile-container">
        <img
          src={userImage}
          alt="next-funder-pic"
          className="next-funder-pic"
        />
        <div className="next-funder-name">{name}</div>
      </div>
      <div className="next-funder-amount">₹{amount}</div>
    </div>
  );
}

export default NextFunderCard;
