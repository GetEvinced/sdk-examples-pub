import { render, screen } from "@testing-library/react";
import Listbox from "./Listbox";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Listbox component accessibility test", () => {
  it("analyzes the listbox using EvincedUT", async () => {
    render(<Listbox />);
    const listbox = screen.getByTestId("listbox");

    const results = await EvincedUT.analyzeListbox(listbox);

    expect(results.length).toBeGreaterThan(1);
  });
});
