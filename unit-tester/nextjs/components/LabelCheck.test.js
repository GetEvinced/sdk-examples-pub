import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";
import EvincedUT from "@evinced/unit-tester";

describe("Button Component", () => {
  test("Method 1: Validates that the component has a label", async () => {
    render(<Button />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "button");
  });

  test("Method 2: Validates that the component has a label", async () => {
    render(<Button />);

    const button = screen.getByRole("button", { name: "button" });
    expect(button).toBeInTheDocument();
  });

  test("Method 3: Validates that the component has a label", async () => {
    render(<Button />);

    const button = screen.getByLabelText("button");
    expect(button).toBeInTheDocument();
  });

  test("Ev Analyze Button", async () => {
    render(<Button />);

    const results = await EvincedUT.analyzeButton({ role: "button" });
    expect(results).toHaveNoFailures();
  });
});
