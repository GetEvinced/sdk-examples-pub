import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";
import EvincedUT from "@evinced/unit-tester";

describe("Button Component", () => {
  test("Ev Analyze Button", async () => {
    render(<Button />);

    const results = await EvincedUT.analyzeButton({ role: "button" });
    expect(results).toHaveNoFailures();
  });
});
