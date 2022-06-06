import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./pick-fav-writers.css";
import WriterCard from "./writer-card";
import Button from "../primary-button/button";
import { showSnackbar } from "../../../common/commonActions";
import CustomizedSnackbars from "../../../../components/materialuiSnackbar";
import { getAuthToken } from "../../../common/commonFunctions";
import {
  followMultipleWritersInit,
  getPickFavDataInit,
} from "../../signupActions";
import { useNavigate } from "react-router-dom";
function PickFavWriters() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    pickFavWritersData,
    open,
    variant,
    message,
    followedMultipleWritersSuccess,
    followMultipleWritersFailure,
    followMultipleWriterssData,
    isFollowingMultipleWriters,
  } = useSelector((state) => ({
    pickFavWritersData: state.signupReducer.pickFavWritersData,
    isGettingPickFavWritersData:
      state.signupReducer.isGettingPickFavWritersData,
    pickFavWritersDataError: state.signupReducer.pickFavWritersDataError,
    isFollowingMultipleWriters: state.signupReducer.isFollowingMultipleWriters,
    variant: state.common.snackbar.variant,
    message: state.common.snackbar.message,
    open: state.common.snackbar.open,
    followedMultipleWritersSuccess:
      state.signupReducer.followedMultipleWritersSuccess,
    followMultipleWritersFailure:
      state.signupReducer.followMultipleWritersFailure,
    followMultipleWriterssData: state.signupReducer.followMultipleWriterssData,
    followMultipleWritersErrorMsg:
      state.signupReducer.followMultipleWritersErrorMsg,
  }));

  const [selection, setSelection] = useState(
    new Array(pickFavWritersData.length)
  );

  useEffect(() => {
    const token = getAuthToken();
    dispatch(getPickFavDataInit({ token }));
  }, []);

  const handleWriterClick = (idx) => {
    const array = selection.slice();
    array[idx] = !array[idx];
    setSelection(array);
  };

  const handleStartReading = () => {
    const token = getAuthToken();
    const array = [];

    selection.forEach((value, idx) => {
      const writerUsername = pickFavWritersData[idx].username;
      if (value) array.push(writerUsername);
    });
    if (array.length < 3) {
      dispatch(
        showSnackbar("You must select at least 3 writers to follow", "error")
      );
      return;
    }
    dispatch(followMultipleWritersInit({ token, usernames: array }));
    setTimeout(() => {
      navigate("/writerDashboard");
    }, 1000);
  };

  useEffect(() => {
    if (followMultipleWritersFailure)
      dispatch(showSnackbar("Error Occurred while following writers", "error"));
  }, [followMultipleWritersFailure]);
  useEffect(() => {
    if (followedMultipleWritersSuccess)
      dispatch(
        showSnackbar(
          `Followed ${followMultipleWriterssData.followedCount} writers`,
          "success"
        )
      );
  }, [followedMultipleWritersSuccess]);

  return (
    <div className="pick-writers-container">
      <h3 className="pick-writers-header">Pick your favourite writers</h3>
      <div className="pick-writers-separator"></div>
      {/* <div className="tags-container">
        {tagsData.map((tag, idx) => (
          <button
            className={`tag-button ${idx === 1 ? "blue-tag" : ""}`}
            key={idx}
          >
            {tag}
          </button>
        ))}
      </div> */}
      <div className="writers-div">
        {pickFavWritersData.map((writer, idx) => (
          <div
            key={idx}
            style={
              selection[idx]
                ? { border: "4px solid #1395FD", borderRadius: "16px" }
                : { padding: "4px" }
            }
            onClick={() => handleWriterClick(idx)}
          >
            <WriterCard writer={writer} />
          </div>
        ))}
      </div>
      <div className="pick-writers-separator"></div>
      <div className="Mobile-button">
        <Button
          text={"Start Reading"}
          blue
          callback={() => handleStartReading()}
          isDisabled={isFollowingMultipleWriters}
        />
      </div>
      <div className="Desktop-buttons">
        {/* <div className="tags-container">
          {tagsData.map((tag, idx) => (
            <button
              className={`tag-button ${idx === 1 ? "blue-tag" : ""}`}
              key={idx}
            >
              {tag}
            </button>
          ))}
        </div> */}

        <div
          style={{
            minWidth: "312px",
            maxWidth: "368px",
            width: "100%",
          }}
        >
          <Button
            text={"Start Reading"}
            blue
            callback={() => handleStartReading()}
            isDisabled={isFollowingMultipleWriters}
          />
        </div>
      </div>
      <CustomizedSnackbars variant={variant} message={message} openS={open} />
    </div>
  );
}

export default PickFavWriters;
