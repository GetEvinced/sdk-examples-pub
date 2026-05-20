import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Breadcrumbs", () => {
  it("renders breadcrumbs with items", async () => {
    const items = [
      { text: "Home", linkProps: { toPage: "/" } },
      { text: "About", linkProps: { toPage: "/about" } },
    ];

    render(<Breadcrumbs source="test-source" items={items} />);

    const breadcrumbs = screen.getByTestId("breadcrumbs");
    expect(breadcrumbs).toBeDefined(); // or `.toBeTruthy()`

    items.forEach((item) => {
      expect(screen.getByText(item.text)).toBeDefined();
    });

    const element = await screen.findByTestId("breadcrumbs");
    const results = await EvincedUT.analyzeBreadcrumb(element);

    expect(results.length).toBeGreaterThan(1);
  });
});
