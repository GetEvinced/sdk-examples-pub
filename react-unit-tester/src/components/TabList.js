import React, { useState, useRef } from "react";

const TabList = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      setActiveIndex(nextIndex);
      tabRefs.current[nextIndex].focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      setActiveIndex(prevIndex);
      tabRefs.current[prevIndex].focus();
    }
  };

  return (
    <div data-testid="tab-list-container">
      {/* ✅ Tablist contains only the tabs (no tabpanels) */}
      <div role="tablist" aria-label="Main Navigation Tabs" data-testid="tab-list">
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            id={`tab-${index}`}
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${index}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            data-testid={`tab-${index}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ✅ Tabpanels are placed outside of the tablist */}
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeIndex !== index}
          tabIndex={activeIndex === index ? 0 : -1}
          data-testid={`tab-panel-${index}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default TabList;
