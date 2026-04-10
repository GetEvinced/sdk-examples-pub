import React, { useState } from "react";

const Listbox = () => {
  const [activeOption, setActiveOption] = useState("ss_opt1");

  const options = [
    { id: "ss_opt1", text: "Proximity of public K-12 schools" },
    { id: "ss_opt2", text: "Proximity of child-friendly parks" },
    { id: "ss_opt3", text: "Proximity of grocery shopping" },
    { id: "ss_opt4", text: "Proximity of fast food" },
    { id: "ss_opt5", text: "Proximity of fine dining" },
    { id: "ss_opt6", text: "Neighborhood walkability" },
    { id: "ss_opt7", text: "Availability of public transit" },
    { id: "ss_opt8", text: "Proximity of hospital and medical services" },
    { id: "ss_opt9", text: "Level of traffic noise" },
    { id: "ss_opt10", text: "Access to major highways" },
  ];

  const handleKeyDown = (e) => {
    const currentIndex = options.findIndex((option) => option.id === activeOption);
    let newIndex = currentIndex;

    if (e.key === "ArrowDown") {
      newIndex = (currentIndex + 1) % options.length;
    } else if (e.key === "ArrowUp") {
      newIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = options.length - 1;
    } else if (e.key === "Tab") {
      return;
    }

    setActiveOption(options[newIndex].id);
    e.preventDefault();
  };

  return (
    <div
      data-testid="listbox"
      role="listbox"
      aria-labelledby="ss_imp_l"
      aria-activedescendant={activeOption}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <label id="ss_imp_l" className="listbox-label">
        Important Features:
      </label>
      <ul role="group" aria-label="group">
        {options.map((option) => (
          <li
            key={option.id}
            id={option.id}
            role="option"
            tabIndex={option.id === activeOption ? "0" : "-1"}
            className={option.id === activeOption ? "active" : ""}
          >
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listbox;
