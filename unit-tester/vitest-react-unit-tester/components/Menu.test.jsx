import { render, screen } from "@testing-library/react";
import Menu from "./Menu";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Menu component accessibility test", () => {
  it("analyzes the menu using EvincedUT", async () => {
    render(<Menu />);
    const menu = screen.getByTestId("menu");
    const results = await EvincedUT.analyzeMenu(menu);

    expect(results.length).toBeGreaterThan(4);
  });
});
