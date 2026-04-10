import React, { useState } from "react";

const Disclosure = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDisclosure = () => {
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && isOpen) {
      setIsOpen(false);
      event.target.focus();
    }
  };

  return (
    <div>
      <button
        id="myDisclosure"
        aria-controls="disclosureContent"
        aria-expanded={isOpen}
        onClick={toggleDisclosure}
        onKeyDown={handleKeyDown}
      >
        {isOpen ? "Hide Details" : "Show Details"}
      </button>
      {isOpen && (
        <div id="disclosureContent">
          <p>Here are some details revealed when the disclosure is open.</p>
        </div>
      )}
    </div>
  );
};

export default Disclosure;