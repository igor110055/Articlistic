import "./fundingPerksCard.css";
import React from "react";

function FundingPerksCard({ writerName }) {
  return (
    <div className="funding-perks-container">
      <div className="funding-perks-content">
        <h3 className="funding-perks-title">Funding Perks</h3>
        <h5 className="funding-perks-subtitle">
          Fund and unlock these benefits:
        </h5>
        <div className="funding-perks-benefits">
          <div className="first-perk">
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="first-perk-svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.31445 18.7559C14.285 18.7559 18.3145 14.7264 18.3145 9.75586C18.3145 4.7853 14.285 0.755859 9.31445 0.755859C4.34389 0.755859 0.314453 4.7853 0.314453 9.75586C0.314453 14.7264 4.34389 18.7559 9.31445 18.7559ZM9.31445 16.9299C13.2771 16.9299 16.4895 13.7175 16.4895 9.75488C16.4895 5.79224 13.2771 2.57988 9.31445 2.57988C5.35181 2.57988 2.13945 5.79224 2.13945 9.75488C2.13945 13.7175 5.35181 16.9299 9.31445 16.9299Z"
                fill="url(#paint0_linear_2012_7731)"
              />
              <path
                d="M9.3137 5.51021L10.2667 8.44336H13.3508L10.8557 10.2561L11.8088 13.1893L9.3137 11.3765L6.81861 13.1893L7.77165 10.2561L5.27656 8.44336H8.36066L9.3137 5.51021Z"
                fill="url(#paint1_linear_2012_7731)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2012_7731"
                  x1="23.985"
                  y1="6.48241"
                  x2="5.67145"
                  y2="-4.52348"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2012_7731"
                  x1="23.985"
                  y1="6.48241"
                  x2="5.67145"
                  y2="-4.52348"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
              </defs>
            </svg>
            <div className="perk-svg-container">
              <div className="perk-text">Get featured infront of</div>{" "}
              <div className="perk-text">
                <span className="blue-perk-text">15k+ like-minded readers</span>
                .
              </div>
            </div>
          </div>
          <div className="second-perk">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="second-perk-svg"
            >
              <path
                d="M11.5905 15.3105C11.1124 14.8552 10.8145 14.2124 10.8145 13.5C10.8145 12.1193 11.9337 11 13.3145 11C14.1323 11 14.8584 11.3927 15.3145 11.9998C15.7705 11.3927 16.4966 11 17.3145 11C18.6952 11 19.8145 12.1193 19.8145 13.5C19.8145 14.2124 19.5165 14.8552 19.0385 15.3105L15.3145 19.5L11.5905 15.3105Z"
                fill="url(#paint0_linear_2012_7773)"
              />
              <path
                d="M10.7068 16.1177C10.4144 16.154 10.1165 16.1727 9.81422 16.1727C5.85272 16.1727 2.64129 12.9613 2.64129 8.99977C2.64129 5.03827 5.85272 1.82684 9.81422 1.82684C13.7757 1.82684 16.9872 5.03827 16.9872 8.99977C16.9872 9.35381 16.9615 9.70186 16.912 10.0422C17.1032 10.0144 17.2996 10 17.5 10C17.9352 10 18.3518 10.0681 18.7362 10.1925C18.7878 9.80231 18.8145 9.40427 18.8145 9C18.8145 4.02944 14.785 0 9.81445 0C4.84389 0 0.814453 4.02944 0.814453 9C0.814453 13.9706 4.84389 18 9.81445 18C10.6102 18 11.3819 17.8967 12.1168 17.7028L10.7068 16.1177Z"
                fill="url(#paint1_linear_2012_7773)"
              />
              <path
                d="M10.8154 5.11914H9.37891V8.59939L6.36352 10.3403L7.08178 11.5844L10.814 9.42961L10.8134 9.4287H10.8154V5.11914Z"
                fill="url(#paint2_linear_2012_7773)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2012_7773"
                  x1="25.8001"
                  y1="6.20376"
                  x2="6.20586"
                  y2="-5.2698"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2012_7773"
                  x1="25.8001"
                  y1="6.20376"
                  x2="6.20586"
                  y2="-5.2698"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_2012_7773"
                  x1="25.8001"
                  y1="6.20376"
                  x2="6.20586"
                  y2="-5.2698"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
              </defs>
            </svg>
            <div className="perk-svg-container"></div>
            <div className="perk-text">Unlock early access.</div>
          </div>
          <div className="first-perk">
            <svg
              width="19"
              height="17"
              viewBox="0 0 19 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="third-perk-svg"
            >
              <path
                d="M12.6584 11.4977C12.6806 11.1025 12.7308 10.6725 12.8338 10.2728C12.9429 9.84969 13.1249 9.40543 13.4469 9.08614C14.0385 8.4997 14.8648 8.33248 15.558 8.55529C16.2731 8.78511 16.8241 9.42548 16.8241 10.3494H15.8241C15.8241 9.8775 15.5705 9.60969 15.252 9.50733C14.9117 9.39795 14.4755 9.47455 14.151 9.79629C14.015 9.93109 13.8924 10.1725 13.8022 10.5224C13.7251 10.8212 13.6816 11.1599 13.6602 11.4969H17.0316C17.5839 11.4969 18.0316 11.9446 18.0316 12.4969V15.8849C18.0316 16.4372 17.5839 16.8849 17.0316 16.8849H12.6983C12.146 16.8849 11.6983 16.4372 11.6983 15.8849V12.4969C11.6983 11.958 12.1246 11.5186 12.6584 11.4977Z"
                fill="url(#paint0_linear_2012_7792)"
              />
              <path
                d="M8.35028 6.13918L0.83298 1.43074C1.16918 0.799131 1.83418 0.369141 2.59961 0.369141H14.2917C15.0209 0.369141 15.659 0.759423 16.0084 1.34251L8.35028 6.13918Z"
                fill="url(#paint1_linear_2012_7792)"
              />
              <path
                d="M8.48708 7.23345L16.2915 2.34514L16.2917 2.36914V7.71948C15.8731 7.49838 15.4135 7.37622 14.9312 7.37622C13.3072 7.37622 11.94 8.76125 11.5332 10.6448C10.8552 11.0509 10.5468 11.9603 10.6186 13.0618H2.59961C1.49504 13.0618 0.599609 12.1664 0.599609 11.0618V2.46453L8.21347 7.23345L8.29057 7.35654L8.35028 7.31914L8.40999 7.35654L8.48708 7.23345Z"
                fill="url(#paint2_linear_2012_7792)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2012_7792"
                  x1="32.3328"
                  y1="16.885"
                  x2="1.92494"
                  y2="-10.8993"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.153491" stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2012_7792"
                  x1="32.3328"
                  y1="16.885"
                  x2="1.92494"
                  y2="-10.8993"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.153491" stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_2012_7792"
                  x1="32.3328"
                  y1="16.885"
                  x2="1.92494"
                  y2="-10.8993"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.153491" stopColor="#0A2B98" />
                  <stop offset="1" stopColor="#1395FD" />
                </linearGradient>
              </defs>
            </svg>
            <div className="perk-svg-container">
              <div className="perk-text">Unlock direct messaging</div>{" "}
              <div className="perk-text">
                with <span className="blue-perk-text">{writerName}</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundingPerksCard;
