import React, { useState } from "react";

const ToggleButton = ({ label, id, onToggle }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleClick = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div>
      <button
        id={id}
        aria-pressed={isToggled}
        onClick={handleClick}
        data-testid="toggle-button"
      >
        {isToggled ? `${label} On` : `${label} Off`}
      </button>
    </div>
  );
};

export default ToggleButton;
