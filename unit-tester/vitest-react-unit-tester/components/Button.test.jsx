import { render } from "@testing-library/react";
import Button from "./Button";
import EvincedUT from "@evinced/unit-tester";
import { describe, test, expect } from "vitest";

describe("Button Component", () => {
  test("Ev Analyze Button", async () => {
    render(<Button />);

    const results = await EvincedUT.analyzeButton({ role: "button" });

    expect(results.length).toBe(4);
  });
});
