import { render, screen } from "@testing-library/react";
import Link from "./Link";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Link component accessibility test", () => {
  it("analyzes the link using EvincedUT", async () => {
    render(<Link />);
    const link = screen.getByText(/Evinced Site/i);

    const results = await EvincedUT.analyzeLink(link);


    expect(results.length).toBe(4);
  });
});
