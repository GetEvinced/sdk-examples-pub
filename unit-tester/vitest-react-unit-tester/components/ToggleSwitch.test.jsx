import { render } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester";
import ToggleSwitch from "./ToggleSwitch";
import { describe, it, expect } from "vitest";

describe("ToggleSwitch Evinced Accessibility Test", () => {
  it("should have no accessibility failures", async () => {
    render(<ToggleSwitch id="my-switch" label="Enable feature" />);

    const results = await EvincedUT.analyzeSwitch(
      { id: "my-switch" },
      {
        userEventOptions: { delay: 10 },
      }
    );
    expect(results.length).toBe(4);
  });
});
