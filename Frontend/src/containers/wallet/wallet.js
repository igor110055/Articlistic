import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { walletSendOTPInit, walletActivateInit } from "./walletActions";
import { getAuthToken } from "../common/commonFunctions";
// import FundTheWritersCard from "./components/fundTheWritersCard/fundTheWritersCard";
// import EarningsCard from "./components/earningsCard/earningsCard";
// import Transactions from "./components/transactions/transactions";
// import EarningsGraphCard from "./components/earningsGraphCard/earningsGraphCard";
import "./wallet.css";
function Wallet() {
  const [showActivate, setShowActivate] = useState();

  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [samePin, setSamePin] = useState(true);
  const [validPin, setValidPin] = useState(true);
  const dispatch = useDispatch();
  const { sendOTPInit, sendOTPSuccess, sendOTPFailure } = useSelector(
    (state) => ({
      sendOTPInit: state.wallet.sendOTPInit,
      sendOTPSuccess: state.wallet.sendOTPSuccess,
      sendOTPFailure: state.wallet.sendOTPFailure,
    })
  );
  const handleActivate = () => {
    const token = getAuthToken();
    dispatch(walletSendOTPInit({ token }));
  };

  useEffect(() => {
    if (sendOTPSuccess) {
      setShowActivate(true);
    }
  }, [sendOTPSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length < 6) {
      setValidPin(false);
      setSamePin(true);
      return;
    } else if (pin !== confirmPin) {
      setValidPin(true);
      setSamePin(false);
      return;
    }
    setValidPin(true);
    setSamePin(true);

    const token = getAuthToken();
    const email = JSON.parse(localStorage.getItem("user")).userEmailID;
    console.log(email);
    dispatch(walletActivateInit({ token, email, otp, pin }));
  };

  return (
    <div className="wallet-container">
      <h3>Wallet</h3>
      {/* <div className="wallet-cards-container">
        <div className="fund-the-writers-container">
          <FundTheWritersCard />
        </div>
        <div className="other-cards-container">
          <div className="earings-container">
            <EarningsCard />
            <EarningsGraphCard />
          </div>
          <Transactions />
        </div>
      </div> */}
      <button
        onClick={() => {
          handleActivate();
        }}
      >
        Activate Wallet{" "}
      </button>

      {showActivate && (
        <div>
          <form
            style={{
              maxWidth: "200px",
              width: "50%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              type="text"
              onChange={(e) => setOtp(e.target.value)}
              placeholder="enter otp"
            />
            <input
              type="text"
              onChange={(e) => setPin(e.target.value)}
              placeholder="enter pin"
            />
            {!validPin && <p>Enter valid Pin</p>}
            <input
              type="text"
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="confirm pin"
            />
            {!samePin && <p>Pins do not match</p>}
            <button type="submit" onClick={(e) => handleSubmit(e)}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Wallet;
