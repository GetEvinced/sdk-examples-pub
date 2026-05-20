import React from "react";

const Meter = ({ value, min = 0, max = 100, label }) => {
  return (
    <div>
      <label htmlFor="progress-meter">{label}</label>
      <meter
        id="progress-meter"
        data-testid="meter-component"
        value={value}
        min={min}
        max={max}
      />
    </div>
  );
};

export default Meter;
