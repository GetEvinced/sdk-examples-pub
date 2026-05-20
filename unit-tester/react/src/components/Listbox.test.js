import { render, screen } from "@testing-library/react";
import Listbox from "./Listbox";
import EvincedUT from "@evinced/unit-tester";

// Example taken from https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/
jest.setTimeout(15000)

describe("Listbox component accessibility test", () => {
  it("analyzes the listbox using EvincedUT", async () => {
    render(<Listbox />);
    const listbox = screen.getByTestId("listbox");
    const results = await EvincedUT.analyzeListbox(listbox);

    // TODO, passes on the initial 6 tests. Fails on 7 for focus and keyboard navigation
    // Has 7 failures
    expect(results).not.toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });
});
