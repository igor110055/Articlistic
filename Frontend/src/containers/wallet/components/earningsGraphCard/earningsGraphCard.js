import "./earningsGraphCard.css";
import earningsGraphImage from "../../../../Images/earningsGraphImage.png";
function EarningsGraphCard() {
  return (
    <div className="earnings-graph">
      <div className="header">
        <h3 className="earnings-text">Earnings</h3>
        <div className="date-picker">
          May 2020
          <div className="svg-date-picker">
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="#979797"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="earnings-graph-separator" />
      <div className="dummy-image">
        <img src={earningsGraphImage} alt="graph" />
      </div>
    </div>
  );
}

export default EarningsGraphCard;
