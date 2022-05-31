import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./pick-fav-writers.css";
import WriterCard from "./writer-card";
import Button from "../primary-button/button";
import Jarret from "../../../../Images/Jarret.png";
import Nathan from "../../../../Images/Nathan.png";
import Ashley from "../../../../Images/Ashley.png";
import Margot from "../../../../Images/Margot.png";
import Carl from "../../../../Images/Carl.png";
import Shawn from "../../../../Images/Shawn.png";
import { getAuthToken } from "../../../common/commonFunctions";
import { followWriterInit, getPickFavDataInit } from "../../signupActions";
import { useNavigate } from "react-router-dom";
function PickFavWriters() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    pickFavWritersData,
    isGettingPickFavWritersData,
    pickFavWritersDataError
  } = useSelector(state => ({
    pickFavWritersData: state.signupReducer.pickFavWritersData,
    isGettingPickFavWritersData:
      state.signupReducer.isGettingPickFavWritersData,
    pickFavWritersDataError: state.signupReducer.pickFavWritersDataError
  }));

  const [selection, setSelection] = useState(
    new Array(pickFavWritersData.length)
  );

  useEffect(() => {
    const token = getAuthToken();
    dispatch(getPickFavDataInit({ token }));
  }, []);

  const handleWriterClick = idx => {
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
    // console.log(token, array);
    dispatch(followWriterInit({ token, usernames: array }));
    navigate("/writerDashboard");
  };
  const tagsData = [
    "All",
    "Technology",
    "Design",
    "Health",
    "Cultures",
    "Sports",
    "Economy",
    "Politics",
    "Technology",
    "Design",
    "Health",
    "Cultures",
    "Sports",
    "Economy",
    "Politics"
  ];

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
        <Button text={"Start Reading"} blue />
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
            width: "100%"
          }}
        >
          <Button
            text={"Start Reading"}
            blue
            callback={() => handleStartReading()}
          />
        </div>
      </div>
    </div>
  );
}

export default PickFavWriters;
