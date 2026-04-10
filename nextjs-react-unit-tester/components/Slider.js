import React from "react";

const Slider = ({ min = 0, max = 100, value, label, onChange }) => {
  return (
    <div>
      <label htmlFor="slider" data-testid="slider-label">
        {label}
      </label>
      <input
        type="range"
        id="slider"
        data-testid="slider-component"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Slider;
