import { render, screen } from "@testing-library/react";
import ButtonList from "./MultipleComponents";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect, vi } from "vitest";

describe("ButtonList Component", () => {
  const buttonsData = Array.from({ length: 10 }, (_, index) => ({
    label: `Button ${index + 1}`,
    onClick: vi.fn(),
  }));


  it("Ev Analyze each button individually", async () => {
    render(<ButtonList buttons={buttonsData} />);
    const buttons = screen.getAllByRole("button");

    for (const button of buttons) {
      const results = await EvincedUT.analyzeButton({ element: button });
      expect(results.length).toBe(4);
    }
  });
});
