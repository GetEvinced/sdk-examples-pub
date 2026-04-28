import { render, screen } from "@testing-library/react";
import TextInput from "./TextInput";
import EvincedUT from "@evinced/unit-tester";

describe("Text Input component accessibility test", () => {
  it("analyzes the text input using EvincedUT", async () => {
    render(
      <TextInput 
        id="username" 
        label="Username" 
        placeholder="Enter your username" 
        value="" 
        required={true}
        pattern="^[a-zA-Z0-9]+$"
        errorMessage="Username can only contain letters and numbers."
        onChange={() => {}}
      />
    );

    const textInput = screen.getByTestId("text-input");
    const results = await EvincedUT.analyzeTextInput(textInput);

    // TO DO - this has 1 failure atm
    expect(results).not.toHaveNoFailures();
    console.log("Evinced Test Results =", results);
  });

});
