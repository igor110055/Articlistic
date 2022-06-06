import "./input.css";
import React from "react";

function Input({
  labelName,
  placeholder,
  labelColor,
  inputBorderColor,
  type,
  onChange,
  onfocus,
}) {
  return (
    <div className="primary-input-div">
      <label style={{ color: `${labelColor}` }}>{labelName}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderColor: `${inputBorderColor}` }}
        onFocus={() => onfocus(true)}
        onBlur={() => onfocus(false)}
      />
    </div>
  );
}

export default Input;
