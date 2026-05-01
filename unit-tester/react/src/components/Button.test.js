import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";
import EvincedUT from "@evinced/unit-tester";

describe("Button Component", () => {
  test("renders the button with correct text and class", () => {
    render(<Button openModal={jest.fn()} />);

    const button = screen.getByRole("button", { name: /open modal/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("openButton");
    expect(button).toHaveAttribute("id", "openButton");
  });

  test("calls openModal when clicked", () => {
    const openModalMock = jest.fn();
    render(<Button openModal={openModalMock} />);

    const button = screen.getByRole("button", { name: /open modal/i });
    fireEvent.click(button);
    expect(openModalMock).toHaveBeenCalledTimes(1);
  });

  test("Ev Analyze Button", async () => {
    render(<Button />);

    const results = await EvincedUT.analyzeButton({ role: "button" });
    expect(results).toHaveNoFailures();
  });
});
