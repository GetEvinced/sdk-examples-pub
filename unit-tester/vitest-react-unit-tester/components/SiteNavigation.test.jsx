import { render, screen } from "@testing-library/react";
import SiteNavigation from "./SiteNavigation";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Site Navigation component accessibility test", () => {
  it("analyzes the site navigation using EvincedUT", async () => {
    render(<SiteNavigation />);

    const navElement = screen.getByTestId("site-navigation");
    const results = await EvincedUT.analyzeSiteNavigation(navElement);

    expect(results.length).toBeGreaterThan(1);

    console.log("Evinced Test Results =", results);
  });
});
