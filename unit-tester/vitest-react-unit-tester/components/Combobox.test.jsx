import { render, screen } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester";
import Combobox from "./Combobox";
import { test, expect } from "vitest";

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

  expect(results.length).toBe(15);
});
