import { render, screen } from "@testing-library/react";
import Switch from "./Switch";
import EvincedUT from "@evinced/unit-tester";

jest.setTimeout(30000);

describe("Switch component accessibility test", () => {
  it("analyzes the switch component using EvincedUT", async () => {
    render(<Switch label="Enable notifications" />);

    const switchElement = screen.getByTestId("switch-component");
    const results = await EvincedUT.analyzeSwitch(switchElement);

    expect(results).toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });
});
