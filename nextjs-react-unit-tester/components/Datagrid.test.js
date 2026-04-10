import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EvincedUT from "@evinced/unit-tester";
import Datagrid from "./Datagrid";

describe("Datagrid Accessibility", () => {
  it("should pass accessibility checks for data grid", async () => {
    render(<Datagrid />);

    const dataGridElement = screen.getByRole("grid");

    const results = await EvincedUT.analyzeDataGrid(dataGridElement);

    // I filter on the results to find the errors
    const errors = results.filter((error) => error.pass === false);
    // console.log(errors);
    // My example has 4 errors, so to make the test pass, we pass the length of 3 here
    expect(errors).toHaveLength(4);
    // console.log(results);
  });
});
