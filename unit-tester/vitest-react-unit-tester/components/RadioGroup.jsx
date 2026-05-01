import React from "react";

const RadioGroup = ({ name, options, label }) => {
  return (
    <fieldset data-testid="radio-group">
      <legend>{label}</legend>
      {options.map((option) => (
        <label key={option.value}>
          <input type="radio" name={name} value={option.value} />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
};

export default RadioGroup;
