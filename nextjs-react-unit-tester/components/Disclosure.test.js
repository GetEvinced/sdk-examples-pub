import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvincedUT from "@evinced/unit-tester";
import Disclosure from "./Disclosure";

describe("Disclosure Accessibility", () => {
  it("should pass accessibility checks for the disclosure button", async () => {
    render(<Disclosure />);

    // Analyze the disclosure button for accessibility
    const results = await EvincedUT.analyzeDisclosure(
      { id: "myDisclosure" },
      { evalEscape: true }
    );

    console.log(results);

    // Expect no accessibility failures
    expect(results).toHaveNoFailures();
  });
});
