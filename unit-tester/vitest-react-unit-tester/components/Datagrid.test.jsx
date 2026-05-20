import { render, screen } from "@testing-library/react";
import EvincedUT from "@evinced/unit-tester";
import Datagrid from "./Datagrid";
import { describe, it, expect } from "vitest";

describe("Datagrid Accessibility", () => {
  it("should pass accessibility checks for data grid", async () => {
    render(<Datagrid />);

    const dataGridElement = screen.getByRole("grid");

    const results = await EvincedUT.analyzeDataGrid(dataGridElement);

    expect(results).toHaveLength(12);
  });
});
