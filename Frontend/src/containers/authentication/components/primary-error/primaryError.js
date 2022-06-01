import React from "react";
import { ReactComponent as ErrorSvg } from "../../../../Images/VectorErrorAlert.svg";
import "./primaryError.css";
function PrimaryError({ message }) {
  return (
    <p className="wrong-email">
      <span>
        <ErrorSvg />
      </span>
      <span>{message}</span>
    </p>
  );
}

export default PrimaryError;
