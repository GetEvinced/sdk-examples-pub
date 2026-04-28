import React, { useRef } from "react";

const Menu = () => {
  const menuRef = useRef(null);
  // Dummy nav bar

  // Note, JSDOM doesn't actually support href links, either mock them or us # values
  const menuItems = [
    { id: "menu_home", text: "Home", href: "#" },
    { id: "menu_about", text: "About", href: "#" },
    { id: "menu_services", text: "Services", href: "#" },
    { id: "menu_contact", text: "Contact", href: "#" },
  ];

  const handleKeyDown = (e, currentIndex) => {
    const menuItems = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'));
    let newIndex = currentIndex;

    if (e.key === "ArrowDown") {
      newIndex = (currentIndex + 1) % menuItems.length;
    } else if (e.key === "ArrowUp") {
      newIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = menuItems.length - 1;
    } else if (e.key === "Tab" && e.shiftKey) {
      e.target.blur();
      return;
    }

    if (newIndex !== currentIndex) {
      menuItems[newIndex].focus();
      e.preventDefault();
    }
  };

  const handleBlur = (e) => {
    const menu = menuRef.current;
    if (!menu.contains(e.relatedTarget)) {
      menu.setAttribute("data-focus-out", "true");
    }
  };

  return (
    <nav
      aria-label="Main Menu"
      data-testid="menu"
      role="menubar"
      aria-orientation="vertical"
      onBlur={handleBlur}
    >
      <ul role="menubar" ref={menuRef}>
        {menuItems.map((item, index) => (
          <li key={item.id} role="none">
            <a
              id={item.id}
              role="menuitem"
              href={item.href}
              tabIndex={index === 0 ? "0" : "-1"}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
