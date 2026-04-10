import React, { useState, useRef } from "react";
import Popup from "./Popup";

export const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef(null);

  const openModal = () => {
    // store the currently focused element (launcher button)
    launcherRef.current = document.activeElement;
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // restore focus to the launcher button when needed
    if (launcherRef.current) {
      launcherRef.current.focus();
    }
  };

  return (
    <div>
      <button onClick={openModal} ref={launcherRef}>
        Open Modal
      </button>
      {isOpen && <Popup closeModal={closeModal} isOpen={isOpen} />}
    </div>
  );
};
