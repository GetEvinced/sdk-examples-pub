import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Modal } from "./Modal";
import EvincedUT from "@evinced/unit-tester";

// jest.setTimeout(10000);

describe("Modal Component", () => {
  it("renders the open button", async () => {
    render(<Modal />);
    const openButton = screen.getByText("Open Modal");
    expect(openButton).toBeInTheDocument();
  });

  it("opens the modal when the button is clicked", async () => {
    render(<Modal />);

    // Ensure modal is not visible initially
    expect(
      screen.queryByText("This is a modal example")
    ).not.toBeInTheDocument();

    // You can ignore this, it is solely for debugging reasons, it will always show an error with the linter
    // screen.debug();

    const buttonElement = screen.getByRole("button");

    // The analyzeModal method will handle the activation of the modal for you, there is no need to activate it yourself in the test
    const results = await EvincedUT.analyzeModal(
      { element: buttonElement },
      { modalLocator: { id: "modal" } }
    );
    expect(results).toHaveNoFailures();
  });

  it("closes the modal when the close button is clicked", () => {
    render(<Modal />);
    const openButton = screen.getByText("Open Modal");

    // Open modal
    fireEvent.click(openButton);
    const closeButton = screen.getByText("Close");

    // Close modal
    fireEvent.click(closeButton);
    // Confirm modal isn't open
    expect(
      screen.queryByText("This is a modal example")
    ).not.toBeInTheDocument();
  });
});
