import { render, screen } from "@testing-library/react";
import Meter from "./Meter";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Meter component accessibility test", () => {
  it("analyzes the meter component using EvincedUT", async () => {
    render(<Meter value={50} label="Progress" />);

    const meterElement = screen.getByTestId("meter-component");
    const results = await EvincedUT.analyzeMeter(meterElement);

    expect(results.length).toBe(2);

    console.log("Evinced Test Results =", results);
  });
});
