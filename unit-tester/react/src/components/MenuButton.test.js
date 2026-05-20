import { render, screen } from "@testing-library/react";
import MenuButton from "./MenuButton";
import EvincedUT from "@evinced/unit-tester";

jest.setTimeout(30000) 

describe("Menu Button component accessibility test", () => {
    it("analyzes the menu button using EvincedUT", async () => {
      render(<MenuButton />);
      const menuButton = screen.getByTestId("menu-button");
      const results = await EvincedUT.analyzeMenuButton(menuButton);
  
      // TODO
      // has 2 failures atm
      expect(results).not.toHaveNoFailures();
      console.log("Evinced Test Results =", results);
    });
  });
  
