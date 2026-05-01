import { render, screen } from "@testing-library/react";
import Slider from "./Slider";
import EvincedUT from "@evinced/unit-tester";

describe("Slider component accessibility test", () => {
  it("analyzes the slider component using EvincedUT", async () => {
    render(<Slider value={50} label="Adjust volume" onChange={() => {}} />);

    const sliderElement = screen.getByTestId("slider-component");
    const results = await EvincedUT.analyzeSlider(sliderElement);

    expect(results).toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });
});
