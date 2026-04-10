import { render, screen } from "@testing-library/react";
import Table from "./Table";
import EvincedUT from "@evinced/unit-tester";
import { describe, it, expect } from "vitest";

describe("Table component accessibility test", () => {
  it("analyzes the table component using EvincedUT", async () => {
    const sampleData = [
      { name: "Alice Johnson", position: "Engineer", department: "IT" },
      { name: "Bob Smith", position: "Manager", department: "HR" },
      { name: "Charlie Davis", position: "Designer", department: "Marketing" },
    ];

    render(<Table data={sampleData} />);

    const tableElement = screen.getByTestId("table-component");
    const results = await EvincedUT.analyzeTable(tableElement);

    expect(results.length).toBe(7);

    console.log("Evinced Test Results =", results);
  });
});
