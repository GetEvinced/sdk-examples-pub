import { render, screen } from "@testing-library/react";
import MultiThumbSlider from "./MultiThumbSlider";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Multi Thumb Slider component accessibility test", () => {
  it("analyzes the multi-thumb slider using EvincedUT", async () => {
    render(
      <MultiThumbSlider min={0} max={100} step={1} label="Adjust range" />
    );

    const sliderElement = screen.getByTestId("multi-thumb-slider");
    const results = await EvincedUT.analyzeMultiThumbSlider(sliderElement);

    expect(results.length).toBe(8);

    console.log("Evinced Test Results =", results);
  });
});
