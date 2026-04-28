import React from "react";

const Button = ({ openModal }) => {
  return (
    <button
      id="openButton"
      className="openButton"
      onClick={openModal}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      }}
    >
      Open Modal
    </button>
  );
};

export default Button;
