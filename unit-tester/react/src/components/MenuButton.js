import React, { useState, useRef } from "react";

const MenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    buttonRef.current?.setAttribute("aria-expanded", newState ? "true" : "false");

    if (newState) {
      moveFocusToFirstMenuItem();
    }
  };

  const closeMenu = (event) => {
    if (event) event.preventDefault();
    setIsOpen(false);
    buttonRef.current?.setAttribute("aria-expanded", "false");
    buttonRef.current?.focus();
  };

  const moveFocusToFirstMenuItem = () => {
    const firstMenuItem = menuRef.current?.querySelector('[role="menuitem"]');
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu(event);
    } else if ((event.key === "Enter" || event.key === " ") && isOpen) {
      closeMenu(event);
    } else if ((event.key === "Enter" || event.key === " ") && !isOpen) {
      toggleMenu();
    } else if (event.key === "Tab" && isOpen) {
      closeMenu(event);
    }
  };

  const handleMenuKeyNavigation = (event) => {
    const menuItems = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'));
    const currentIndex = menuItems.indexOf(document.activeElement);

    if (event.key === "ArrowDown") {
      const nextIndex = (currentIndex + 1) % menuItems.length;
      menuItems[nextIndex].focus();
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
      menuItems[prevIndex].focus();
      event.preventDefault();
    }
  };

  return (
    <div>
      <button
        aria-haspopup="menu"
        aria-expanded={isOpen ? "true" : "false"}
        aria-label="Options Menu"
        onClick={toggleMenu}
        data-testid="menu-button"
        onKeyDown={handleKeyDown}
        ref={buttonRef}
      >
        Toggle Menu
      </button>
      <ul
        role="menu"
        aria-labelledby="menu-button"
        data-testid="menu"
        ref={menuRef}
        style={{ display: isOpen ? "block" : "none" }}
        onKeyDown={handleMenuKeyNavigation}
      >
        <li role="menuitem" id="menuitem1" tabIndex={isOpen ? "0" : "-1"} aria-labelledby="menuitem1-label">
          <span id="menuitem1-label">Option 1</span>
        </li>
        <li role="menuitem" id="menuitem2" tabIndex={isOpen ? "0" : "-1"} aria-labelledby="menuitem2-label">
          <span id="menuitem2-label">Option 2</span>
        </li>
        <li role="menuitem" id="menuitem3" tabIndex={isOpen ? "0" : "-1"} aria-labelledby="menuitem3-label">
          <span id="menuitem3-label">Option 3</span>
        </li>
      </ul>
    </div>
  );
};

export default MenuButton;
