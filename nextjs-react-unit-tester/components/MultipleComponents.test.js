import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ButtonList from "./MultipleComponents";
import EvincedUT from "@evinced/unit-tester";

describe("ButtonList Component", () => {
  const buttonsData = Array.from({ length: 10 }, (_, index) => ({
    label: `Button ${index + 1}`,
    onClick: jest.fn(),
  }));

  test("renders multiple buttons", () => {
    render(<ButtonList buttons={buttonsData} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(10);

    buttons.forEach((button, index) => {
      expect(button).toHaveTextContent(`Button ${index + 1}`);
      expect(button).toHaveClass("openButton");
      expect(button).toHaveAttribute("id", `button-${index}`);
    });
  });

  test("calls correct function when buttons are clicked", () => {
    render(<ButtonList buttons={buttonsData} />);

    const buttons = screen.getAllByRole("button");

    buttons.forEach((button, index) => {
      fireEvent.click(button);
      expect(buttonsData[index].onClick).toHaveBeenCalledTimes(1);
      expect(buttonsData[index].onClick).toHaveBeenCalledWith(index);
    });
  });

  test("Ev Analyze each button individually", async () => {
    render(<ButtonList buttons={buttonsData} />);

    const buttons = screen.getAllByRole("button");

    for (const button of buttons) {
      const results = await EvincedUT.analyzeButton({ element: button });
      expect(results).toHaveNoFailures();
    }
  });
});
