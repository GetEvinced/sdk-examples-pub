import { render, screen } from "@testing-library/react";
import RadioGroup from "./RadioGroup";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Radio Group component accessibility test", () => {
  it("analyzes the radio group using EvincedUT", async () => {
    render(
      <RadioGroup
        name="example-radio"
        label="Select an option"
        options={[
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
          { label: "Option 3", value: "3" },
        ]}
      />
    );

    const radioGroup = screen.getByTestId("radio-group");
    const results = await EvincedUT.analyzeRadioGroup(radioGroup);

    expect(results.length).toBe(6);

    console.log("Evinced Test Results =", results);
  });
});
