import React, { useState } from "react";

const Accordion = ({ id, sections }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id={id}>
      <div className="accordion">
        {sections.map((section, index) => {
          const toggleAccordion = () => {
            setIsOpen(!isOpen);
          };

          return (
            <div key={index}>
              <h3>
                <button
                  id={`${id}-button-${index}`}
                  onClick={toggleAccordion}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-panel-${index}`}
                >
                  {section.title}
                </button>
              </h3>
              <div
                id={`${id}-panel-${index}`}
                role="region"
                aria-labelledby={`${id}-button-${index}`}
                hidden={!isOpen}
                className={isOpen ? "expanded" : "collapsed"}
                style={{ marginTop: "8px", display: isOpen ? "block" : "none" }}
              >
                {section.content}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Accordion;
