import React, { useState } from "react";

const SpinButton = ({ min = 0, max = 100, step = 1, label }) => {
  const [value, setValue] = useState(min);

  const handleChange = (event) => {
    let newValue = Number(event.target.value);
    if (newValue >= min && newValue <= max) {
      setValue(newValue);
    }
  };

  return (
    <div>
      <label htmlFor="spin-button">{label}</label>
      <input
        type="number"
        id="spin-button"
        data-testid="spin-button"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
    </div>
  );
};

export default SpinButton;
