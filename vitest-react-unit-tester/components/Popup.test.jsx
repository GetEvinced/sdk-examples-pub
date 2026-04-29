import { render, cleanup } from "@testing-library/react";
import Popup from "./Popup";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect, afterEach } from "vitest";

describe("Popup component accessibility test", () => {
  afterEach(() => cleanup());

  it("analyzes the popup (dialog) using EvincedUT", async () => {
    render(<Popup isOpen={true} closeModal={() => {}} />);

    const results = await EvincedUT.analyzeModal(
      { id: "modal" },
      { modalLocator: { id: "modal" } }
    );

    expect(results.length).toBe(1);
  });
});
