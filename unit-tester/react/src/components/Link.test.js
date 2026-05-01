import { render, screen } from "@testing-library/react";
import Link from "./Link";
import EvincedUT from "@evinced/unit-tester";

describe("Link component accessibility test", () => {
  it("renders the component correctly", () => {
    render(<Link />);

    expect(screen.getByText("Evinced Site")).toBeInTheDocument();
  });

  it("analyzes the link using EvincedUT", async () => {
    render(<Link />);
    const link = screen.getByText(/Evinced Site/i);
    const results = await EvincedUT.analyzeLink(link);

    expect(results).toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });
});
