import "./set-up-profile.css";
import Button from "../primary-button/button";
function SetUpProfile({ setDisplayPage }) {
  const handleCreateAccount = () => {
    setDisplayPage("pickFavouriteWriters");
  };
  return (
    <div className="set-up-profile-container">
      <h3 className="set-up-profile-header">Set up your profile </h3>
      <p className="set-up-profile-subtitle">
        Almost there! finish creating your account to experience attentioun.
      </p>
      <form className="user-inputs">
        <label>
          Name
          <input placeholder="Enter your name" />
        </label>
        <label>
          Username
          <input placeholder="Create a username" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create a password" />
        </label>
        <label>
          Country
          <input placeholder="Enter your country" />
        </label>
      </form>

      <Button text={"Create Account"} blue callback={handleCreateAccount} />
    </div>
  );
}

export default SetUpProfile;
