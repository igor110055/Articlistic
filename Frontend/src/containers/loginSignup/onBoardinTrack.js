import "./onBoardingTrack.css";

const OnBoardingTrack = ({ displayPage }) => {
  return (
    <div className="onboarding-track">
      <div className="onboarding-track-internal">
        <div className="track-checkpoint">
          <div className="tick">
            {displayPage === "emailVerification" ||
            displayPage === "createProfile" ||
            displayPage === "mapWritersAndCategories" ? (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="8.5"
                  fill="url(#paint0_linear_0_22948)"
                />
                <path
                  d="M4.83594 9.4715L7.13524 12.044L13.0244 6.04492"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_0_22948"
                    x1="-6.67884"
                    y1="8.5"
                    x2="10.3212"
                    y2="21.8577"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2B56FF" />
                    <stop offset="1" stopColor="#1395FD" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="6.5"
                  stroke="#0095FF"
                  strokeWidth="4"
                />
              </svg>
            )}
          </div>
          <div>Verifiy Mobile</div>
        </div>
        <svg
          width="38"
          height="1"
          viewBox="0 0 38 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.455799"
            d="M0.5 0.5H37.5"
            stroke="#979797"
            strokeLinecap="round"
          />
        </svg>
        <div className="track-checkpoint">
          <div className="tick">
            {displayPage === "createProfile" ||
            displayPage === "mapWritersAndCategories" ? (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="8.5"
                  fill="url(#paint0_linear_0_22948)"
                />
                <path
                  d="M4.83594 9.4715L7.13524 12.044L13.0244 6.04492"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_0_22948"
                    x1="-6.67884"
                    y1="8.5"
                    x2="10.3212"
                    y2="21.8577"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2B56FF" />
                    <stop offset="1" stopColor="#1395FD" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="6.5"
                  stroke="#0095FF"
                  strokeWidth="4"
                />
              </svg>
            )}
          </div>
          <div>Verify Email</div>
        </div>
        <svg
          width="38"
          height="1"
          viewBox="0 0 38 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.455799"
            d="M0.5 0.5H37.5"
            stroke="#979797"
            strokeLinecap="round"
          />
        </svg>
        <div className="track-checkpoint">
          <div className="tick">
            {displayPage === "mapWritersAndCategories" ? (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="8.5"
                  fill="url(#paint0_linear_0_22948)"
                />
                <path
                  d="M4.83594 9.4715L7.13524 12.044L13.0244 6.04492"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_0_22948"
                    x1="-6.67884"
                    y1="8.5"
                    x2="10.3212"
                    y2="21.8577"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2B56FF" />
                    <stop offset="1" stopColor="#1395FD" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="6.5"
                  stroke="#0095FF"
                  strokeWidth="4"
                />
              </svg>
            )}
          </div>
          <div>Create Profile</div>
        </div>
        {/* <svg width="38" height="1" viewBox="0 0 38 1" fill="none" xmlns="http://www.w3.org/2000/svg"> //for writers
                    <path opacity="0.455799" d="M0.5 0.5H37.5" stroke="#979797" strokeLinecap="round" />
                </svg> */}
        {/* <div className="track-checkpoint">
                    <div className="tick">
                        {displayPage === '' ? (<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8.5" cy="8.5" r="8.5" fill="url(#paint0_linear_0_22948)" />
                            <path d="M4.83594 9.4715L7.13524 12.044L13.0244 6.04492" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="paint0_linear_0_22948" x1="-6.67884" y1="8.5" x2="10.3212" y2="21.8577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#2B56FF" />
                                    <stop offset="1" stopColor="#1395FD" />
                                </linearGradient>
                            </defs>
                        </svg>) : (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="8.5" cy="8.5" r="6.5" stroke="#0095FF" strokeWidth="4" />
                            </svg>
                        )}
                    </div>
                    <div>Map Interest</div>
                </div> */}
      </div>
    </div>
  );
};

export default OnBoardingTrack;
