import { render, screen } from "@testing-library/react";
import Switch from "./Switch";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Switch component accessibility test", () => {
  it("analyzes the switch component using EvincedUT", async () => {
    render(<Switch label="Enable notifications" />);

    const switchElement = screen.getByTestId("switch-component");
    const results = await EvincedUT.analyzeSwitch(switchElement);

    expect(results.length).toBe(5);

    console.log("Evinced Test Results =", results);
  });
});
