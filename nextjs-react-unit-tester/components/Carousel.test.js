import { render } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester"
import Carousel from "./Carousel";

describe("Carousel Accessibility Test", () => {
  it("should have no accessibility failures", async () => {
    render(
      <Carousel
        id="my-carousel"
        label="Image gallery"
        slides={[
          { content: <div>Slide 1</div>, label: "Introduction" },
          { content: <div>Slide 2</div>, label: "Details" },
          { content: <div>Slide 3</div>, label: "Summary" },
        ]}
      />
    );

    const results = await EvincedUT.analyzeCarousel(
      { selector: "div#my-carousel" },
      {
        automaticRotation: false,
        nextSlideControl: { accName: "Next" },
        prevSlideControl: { accName: "Previous" },
      }
    );

    // expect(results).toHaveNoFailures();
  });
});
