import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect, } from "vitest";

describe("Modal Component", () => {

  it("opens the modal when the button is clicked (via Evinced analysis)", async () => {
    render(<Modal />);
    const buttonElement = screen.getByRole("button");

    const results = await EvincedUT.analyzeModal(
      { element: buttonElement },
      { modalLocator: { id: "modal" } }
    );
    expect(results.length).toBeGreaterThan(10);
  });

});
