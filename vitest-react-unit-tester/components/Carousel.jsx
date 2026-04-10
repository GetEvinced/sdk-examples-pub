import React, { useState } from "react";

const Carousel = ({ id, slides, label }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div
      id={id}
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        className="slides"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-hidden={index !== currentSlide}
            aria-label={`${index + 1}: ${slide.label}`}
            style={{
              display: index === currentSlide ? "block" : "none",
              position: "absolute",
              width: "100%",
            }}
          >
            {slide.content}
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        aria-label="Previous"
        className="prev"
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        aria-label="Next"
        className="next"
      >
        Next
      </button>
    </div>
  );
};

export default Carousel;
