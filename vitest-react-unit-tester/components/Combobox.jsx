import React, { useState, useEffect, useRef } from "react";

const Combobox = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchString, setSearchString] = useState("");
  const comboRef = useRef(null);
  const listboxRef = useRef(null);

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const activeOption = listboxRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (activeOption && typeof activeOption.scrollIntoView === "function") {
        activeOption.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [activeIndex, isOpen]);

  const toggleListbox = () => setIsOpen((prev) => !prev);

  const handleKeyDown = (event) => {
    const maxIndex = options.length - 1;
    const { key } = event;

    if (!isOpen && ["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
      setIsOpen(true);
      return;
    }

    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          selectOption(activeIndex);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Home":
        setActiveIndex(0);
        break;
      case "End":
        setActiveIndex(maxIndex);
        break;
      default:
        if (key.length === 1) {
          handleTypeAhead(key);
        }
        break;
    }
  };

  const handleTypeAhead = (char) => {
    setSearchString((prev) => prev + char.toLowerCase());
    const index = options.findIndex(
      (option) =>
        option.toLowerCase().startsWith(searchString + char.toLowerCase())
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
    setTimeout(() => setSearchString(""), 500);
  };

  const selectOption = (index) => {
    setIsOpen(false);
    comboRef.current.textContent = options[index];
  };

  const handleBlur = (event) => {
    if (
      listboxRef.current &&
      !listboxRef.current.contains(event.relatedTarget)
    ) {
      setIsOpen(false);
    }
  };

  return (
    <div className="combo js-select" onBlur={handleBlur} role="listbox">
      <label id="combo1-label" className="combo-label" htmlFor="combo1">
        Favorite Fruit
      </label>
      <div
        id="combo1"
        className="combo-input"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="listbox1"
        aria-labelledby="combo1-label"
        aria-activedescendant={isOpen ? `option-${activeIndex}` : undefined}
        tabIndex="0"
        onClick={toggleListbox}
        onKeyDown={handleKeyDown}
        ref={comboRef}
      >
        {options[0]}
      </div>
      {isOpen && (
        <div
          className="combo-menu"
          role="listbox"
          id="listbox1"
          aria-labelledby="combo1-label"
          ref={listboxRef}
        >
          {options.map((option, index) => (
            <div
              key={index}
              id={`option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              className={`combo-option ${
                activeIndex === index ? "option-current" : ""
              }`}
              data-index={index}
              onClick={() => selectOption(index)}
              tabIndex="-1"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Combobox;
