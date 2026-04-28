import React from "react";

const ButtonList = ({ buttons }) => {
  return (
    <div>
      {buttons.map((btn, index) => (
        <button
          key={index}
          id={`button-${index}`}
          className="openButton"
          onClick={() => btn.onClick(index)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              btn.onClick(index);
            }
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonList;
