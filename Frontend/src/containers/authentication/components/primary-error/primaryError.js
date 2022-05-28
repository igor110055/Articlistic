import React from "react";
import { ReactComponent as ErrorSvg } from "../../../../Images/VectorErrorAlert.svg";
import "./primaryError.css";
function PrimaryError({ message }) {
  return (
    <p className="wrong-email">
      <ErrorSvg /> <span>{message}</span>
    </p>
  );
}

export default PrimaryError;
