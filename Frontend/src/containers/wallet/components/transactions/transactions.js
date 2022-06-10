// import  from 'react'
import "./transactions.css";
function Transactions() {
  const transactionsData = [
    {
      articleName: "Campaign: My Black Friend Corrected….",
      date: "03 / 05 / 2020",
      amount: "-1200",
    },
    {
      articleName:
        "Campaign: This Morning Routine will Save You 20+ Hours Per Week",
      date: "03 / 05 / 2020",
      amount: "+3500",
    },
    {
      articleName: "Campaign: My Black Friend Corrected….",
      date: "03 / 05 / 2020",
      amount: "-1200",
    },
    {
      articleName:
        "Campaign: This Morning Routine will Save You 20+ Hours Per Week",
      date: "03 / 05 / 2020",
      amount: "+3500",
    },
    // {
    //   articleName:
    //     "Campaign: This Morning Routine will Save You 20+ Hours Per Week",
    //   date: "03 / 05 / 2020",
    //   amount: "-3500"
    // },
    // {
    //   articleName:
    //     "Campaign: This Morning Routine will Save You 20+ Hours Per Week",
    //   date: "03 / 05 / 2020",
    //   amount: "-3500"
    // },
  ];
  return (
    <div className="transactions">
      <div className="header">
        <h3 className="transactions-text">Transactions</h3>
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
                strokeWidth="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="transactions-separator" />
      <div className="transactions-data">
        {transactionsData.map((transaction) => (
          <div className="one-transaction">
            <div className="transaction-details">
              <p className="transaction-article-name">
                {transaction.articleName}
              </p>
              <p className="transaction-date">{transaction.date}</p>
            </div>
            <div className="transaction-amount">{transaction.amount}</div>
          </div>
        ))}
      </div>
      <div className="transactions-separator"></div>
      <button className="transactions-see-more-button">See More</button>
    </div>
  );
}

export default Transactions;
