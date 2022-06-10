import ReactPinField from "react-pin-field";
import "./enterWalletPinCard.css";
function EnterWalletPinCard() {
  return (
    <div className="enter-pin-content">
      <h3 className="enter-pin-header">Enter Pin</h3>
      <h5 className="enter-pin-subtitle">
        Please Enter your 6-digit wallet pin
      </h5>
      <ReactPinField className="pin-field" length={6} placeholder={"_"} />
    </div>
  );
}

export default EnterWalletPinCard;
