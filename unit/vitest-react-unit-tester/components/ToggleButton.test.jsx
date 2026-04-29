import { render, screen } from "@testing-library/react";
import ToggleButton from "./ToggleButton";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Toggle Button component accessibility test", () => {
  it("analyzes the toggle button using EvincedUT", async () => {
    render(<ToggleButton id="dark-mode-toggle" label="Dark Mode" />);

    const toggleButton = screen.getByTestId("toggle-button");
    const results = await EvincedUT.analyzeToggleButton(toggleButton);

    expect(results.length).toBe(5);

    console.log("Evinced Test Results =", results);
  });
});
