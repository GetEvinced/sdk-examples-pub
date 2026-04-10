import React, { useEffect, useRef } from "react";

const Popup = ({ isOpen, closeModal }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Assert initial focus
      modalRef.current.focus();
      // focusableElements 
      const focusableElements = modalRef.current.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Custom trapFocus function
      const trapFocus = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      modalRef.current.addEventListener("keydown", trapFocus);

      // use if here as current will most likely be null
      return () => {
        if (modalRef.current) {
          modalRef.current.removeEventListener("keydown", trapFocus);
        }
      };
    }
  }, [isOpen]);

  return (
    <div
      role="dialog"
      id="modal"
      aria-label="modal"
      aria-modal={isOpen}
      tabIndex={-1}
      ref={modalRef}
      style={{
        display: isOpen ? "block" : "none",
        visibility: isOpen ? "visible" : "hidden",
      }}
      aria-hidden={!isOpen}
      className={isOpen ? "open" : ""}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          closeModal();
        }
      }}
    >
      <div tabIndex="-1">
        <p tabIndex="-1">This is a modal example</p>
        <button onClick={closeModal} tabIndex="0">
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
