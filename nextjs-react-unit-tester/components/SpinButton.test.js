import { render, screen } from "@testing-library/react";
import SpinButton from "./SpinButton";
import EvincedUT from "@evinced/unit-tester";


describe("Spin Button component accessibility test", () => {
  it("analyzes the spin button using EvincedUT", async () => {
    render(<SpinButton min={0} max={100} step={1} label="Set quantity" />);

    const spinButton = screen.getByTestId("spin-button");
    const results = await EvincedUT.analyzeSpinButton(spinButton);

    expect(results).toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });
});
