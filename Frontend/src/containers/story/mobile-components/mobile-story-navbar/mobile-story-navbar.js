import "./mobile-story-navbar.css";

function MobileStoryNavbar({ publicationName, publicationLogo }) {
  return (
    <div className="mobile-story-navbar">
      <div className="mobile-story-publication-info">
        <img
          src={publicationLogo}
          alt="publication"
          className="mobile-story-publication-logo"
        />
        <h3 className="mobile-story-publication-name">{publicationName}</h3>
      </div>
      <button className="mobile-story-get-started-button">Get Started</button>
    </div>
  );
}

export default MobileStoryNavbar;
