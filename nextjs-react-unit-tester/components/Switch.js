import React, { useState } from "react";

const Switch = ({ label, onChange }) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
    if (onChange) onChange(!isOn);
  };

  return (
    <div>
      <label htmlFor="switch-toggle" id="switch-label">
        {label}
      </label>
      <button
        id="switch-toggle"
        role="switch"
        aria-checked={isOn}
        aria-labelledby="switch-label"
        data-testid="switch-component"
        onClick={handleToggle}
      >
        {isOn ? "On" : "Off"}
      </button>
    </div>
  );
};

export default Switch;
