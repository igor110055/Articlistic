import "./wallet.css";
import FundTheWritersCard from "./components/fundTheWritersCard/fundTheWritersCard";
import EarningsCard from "./components/earningsCard/earningsCard";
import Transactions from "./components/transactions/transactions";
import EarningsGraphCard from "./components/earningsGraphCard/earningsGraphCard";
function Wallet() {
  return (
    <div className="wallet-container">
      <h3>Wallet</h3>
      <div className="wallet-cards-container">
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
      </div>
    </div>
  );
}

export default Wallet;
