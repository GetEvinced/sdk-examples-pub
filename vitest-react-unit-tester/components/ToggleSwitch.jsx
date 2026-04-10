import React, { useState } from "react";

const ToggleSwitch = ({ id, label }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <label htmlFor={id} style={{ display: "block", marginBottom: "8px" }}>
        {label}
      </label>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        aria-checked={isChecked}
        role="switch"
      />
    </div>
  );
};

export default ToggleSwitch;