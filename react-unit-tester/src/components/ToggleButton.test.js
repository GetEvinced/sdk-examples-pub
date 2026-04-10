import { render, screen } from "@testing-library/react";
import ToggleButton from "./ToggleButton";
import EvincedUT from "@evinced/unit-tester";

describe("Toggle Button component accessibility test", () => {
  it("analyzes the toggle button using EvincedUT", async () => {
    render(<ToggleButton id="dark-mode-toggle" label="Dark Mode" />);

    const toggleButton = screen.getByTestId("toggle-button");
    const results = await EvincedUT.analyzeToggleButton(toggleButton);

    expect(results).toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });
});
