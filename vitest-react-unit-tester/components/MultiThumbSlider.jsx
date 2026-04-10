import React, { useState } from "react";

const MultiThumbSlider = ({ min = 0, max = 100, step = 1, label }) => {
  const [values, setValues] = useState({ minValue: min, maxValue: max });

  const handleChange = (event, thumb) => {
    let newValue = Number(event.target.value);
    setValues((prev) => {
      let updatedValues = { ...prev, [thumb]: newValue };
      if (updatedValues.minValue > updatedValues.maxValue) {
        return prev; // Prevent invalid state
      }
      return updatedValues;
    });
  };

  return (
    <div>
      <fieldset>
        <legend>{label}</legend>

        <div data-testid="multi-thumb-slider">
          <label htmlFor="thumb-min">Minimum Value</label>
          <input
            type="range"
            id="thumb-min"
            min={min}
            max={max}
            step={step}
            value={values.minValue}
            onChange={(e) => handleChange(e, "minValue")}
            data-testid="thumb-min"
            aria-labelledby="thumb-min-label"
          />

          <label htmlFor="thumb-max">Maximum Value</label>
          <input
            type="range"
            id="thumb-max"
            min={min}
            max={max}
            step={step}
            value={values.maxValue}
            onChange={(e) => handleChange(e, "maxValue")}
            data-testid="thumb-max"
            aria-labelledby="thumb-max-label"
          />
        </div>
      </fieldset>
    </div>
  );
};

export default MultiThumbSlider;
