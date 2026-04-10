import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Popup from "./Popup";

describe("Popup Component", () => {
  test("renders correctly when open", () => {
    render(<Popup isOpen={true} closeModal={jest.fn()} />);

    // Use the `hidden: true` option to include elements with `aria-hidden`
    const modal = screen.getByRole("dialog", { hidden: true });
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveStyle("display: block");
    expect(modal).toHaveStyle("visibility: visible");
    expect(modal).toHaveClass("open");
    expect(modal).toHaveAttribute("aria-hidden", "false");
  });

  test("does not render when closed", () => {
    render(<Popup isOpen={false} closeModal={jest.fn()} />);

    const modal = screen.getByRole("dialog", { hidden: true });
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveStyle("display: none");
    expect(modal).toHaveStyle("visibility: hidden");
    expect(modal).not.toHaveClass("open");
    expect(modal).toHaveAttribute("aria-hidden", "true");
  });

  test("calls closeModal when the close button is clicked", () => {
    const closeModalMock = jest.fn();
    render(<Popup isOpen={true} closeModal={closeModalMock} />);

    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
