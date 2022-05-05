// import './navbar.css';
import hlogo from './../../Images/horizontal.png';
import searchLogo from './../../Images/search.png';

const Navbar = () => {
    function myFunction() {
        var x = document.getElementById("topNav");
        // console.log(x);
        if (x.className === "navbar") {
            x.className += " responsive";
        } else {
            x.className = "navbar";
        }
    }
    return (
        <div className="navbar" id="topNav">
            <div className="nav-left left">
                <div className="nav-logo">
                    <img src={hlogo} alt="logo" className="nav-logo" />
                </div>
                <div className="nav-search">
                    <img src={searchLogo} alt="search" />
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div className="nav-right right">
                <div className="nav-wallet">Wallet</div>
                <div className="nav-profile">Profile</div>
                <div className="nav-bookmark">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="19.5" cy="19.5" r="19" fill="white" stroke="#CECECE" />
                        <path d="M14 13.5H25" stroke="#3095FF" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M25 29L19.1765 25.069L14 29V10H25V29Z" stroke="#2B406E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="nav-notification">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="19.5" cy="19.5" r="19" fill="white" stroke="#CECECE" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M26 25H13L15.1014 15.9489C15.4983 14.2387 17.3466 13 19.5 13C21.6534 13 23.5017 14.2387 23.8986 15.9489L26 25Z" stroke="#2B406E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        {/* <mask id="mask0_360_4757" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="17" y="26" width="5" height="3">
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.332 26.7227H21.6685V28.9995H17.332V26.7227Z" fill="white" />
                        </mask> */}
                        <g mask="url(#mask0_360_4757)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M21.6685 26.7227C21.6685 27.9804 20.6977 28.9997 19.4999 28.9997C18.3027 28.9997 17.332 27.9804 17.332 26.7227H21.6685Z" fill="#3295FF" />
                        </g>
                        <path d="M19.5 13V11" stroke="#2B406E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </div>
                <div className="nav-login">Login</div>
            </div>
            <div className="icon" onClick={myFunction}>
                icon
            </div>
        </div>
    );
}

export default Navbar;