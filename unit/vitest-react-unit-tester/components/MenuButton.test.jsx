import { render, screen } from "@testing-library/react";
import MenuButton from "./MenuButton";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Menu Button component accessibility test", () => {
  it("analyzes the menu button using EvincedUT", async () => {
    render(<MenuButton />);
    const menuButton = screen.getByTestId("menu-button");
    const results = await EvincedUT.analyzeMenuButton(menuButton);

    expect(results.length).toBe(13);
  });
});
