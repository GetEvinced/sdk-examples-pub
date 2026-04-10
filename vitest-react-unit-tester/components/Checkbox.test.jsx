import { render } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester";
import Checkbox from "./Checkbox";
import { describe, it, expect } from "vitest";

describe("Checkbox Accessibility Test", () => {
  it("should have no accessibility failures", async () => {
    render(
      <Checkbox
        id="my-checkbox"
        label="Accept terms and conditions"
        defaultChecked={false}
      />
    );

    const results = await EvincedUT.analyzeCheckbox(
      { id: "my-checkbox" },
      {
        userEventOptions: { delay: 10 },
      }
    );

    expect(results.length).toBe(4);
  });
});
