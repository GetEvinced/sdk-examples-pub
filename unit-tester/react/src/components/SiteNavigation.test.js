import { render, screen } from "@testing-library/react";
import SiteNavigation from "./SiteNavigation";
import EvincedUT from "@evinced/unit-tester";

describe("Site Navigation component accessibility test", () => {
  it("analyzes the site navigation using EvincedUT", async () => {
    render(<SiteNavigation />);

    const navElement = screen.getByTestId("site-navigation");
    const results = await EvincedUT.analyzeSiteNavigation(navElement);

    // TODO: Modify assertion based on expected failures/success
    expect(results).toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });
});
