import { render } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester";
import Disclosure from "./Disclosure";
import { describe, it, expect } from "vitest";

describe("Disclosure Accessibility", () => {
  it("should pass accessibility checks for the disclosure button", async () => {
    render(<Disclosure />);

    const results = await EvincedUT.analyzeDisclosure(
      { id: "myDisclosure" },
      { evalEscape: true }
    );

    expect(results.length).toBe(9);
  });
});
