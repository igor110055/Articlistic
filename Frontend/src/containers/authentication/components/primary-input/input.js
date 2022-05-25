import "./input.css";
import React from "react";

function Input({
  labelName,
  placeholder,
  labelColor,
  inputBorderColor,
  type,
  onChange,
}) {
  return (
    <div className="primary-input-div">
      <label style={{ color: `${labelColor}` }}>{labelName}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        style={{ borderColor: `${inputBorderColor}` }}
      />
    </div>
  );
}

export default Input;
