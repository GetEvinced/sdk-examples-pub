import { render } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester";
import Feed from "./Feed";
import { describe, it, expect } from "vitest";

describe("Feed Accessibility", () => {
  it("should pass accessibility checks for the feed method", async () => {
    const { container } = render(<Feed />);

    const results = await EvincedUT.analyzeFeed(container);

    expect(results.length).toBe(4);
  });
});
