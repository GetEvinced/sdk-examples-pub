import React, { useState } from "react";

const Checkbox = ({ id, label, defaultChecked = false }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        aria-checked={isChecked}
      />
      <label htmlFor={id} style={{ marginLeft: "8px" }}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;