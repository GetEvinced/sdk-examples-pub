import { render } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester";
import Accordion from "./Accordion";
import { describe, it, expect } from "vitest";

describe("Accordion Evinced Test", () => {
  it("should have no accessibility failures", async () => {
    render(
      <Accordion
        id="my-accordion"
        sections={[
          { title: "Section 1", content: "Content for section 1." },
          { title: "Section 2", content: "Content for section 2." },
        ]}
      />
    );

    const results = await EvincedUT.analyzeAccordion(
      { id: "my-accordion" },
      {
        userEventOptions: { delay: 10 },
      }
    );

    expect(results.length).toBeGreaterThan(0);
  });
});
