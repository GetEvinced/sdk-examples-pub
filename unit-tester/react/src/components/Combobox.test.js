import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvincedUT from "@evinced/unit-tester";
import Combobox from "./Combobox";

jest.setTimeout(10000)

test("accessibility and interaction test for ComboBox component", async () => {
  const options = [
    "Choose a Fruit",
    "Apple",
    "Banana",
    "Blueberry",
    "Cherry",
    "Grape",
  ];

  render(<Combobox options={options} />);

  const combobox = screen.getByRole("combobox");

  // Perform accessibility analysis
  const results = await EvincedUT.analyzeCombobox(combobox);

  // Log results for debugging purposes
  console.log("Accessibility analysis results:", results);

  // Ensure all tests pass
  results.forEach((result) => {
    expect(result.pass).toBe(true);
  });
});
