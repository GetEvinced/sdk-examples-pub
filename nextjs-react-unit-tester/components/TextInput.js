import React, { useState } from "react";

const TextInput = ({ label, id, placeholder, value, onChange, required = false, pattern, errorMessage }) => {
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorText, setErrorText] = useState("");

  const validateInput = (inputValue) => {
    if (required && !inputValue) {
      setErrorText(errorMessage || "This field is required.");
      setIsInvalid(true);
    } else if (pattern && !new RegExp(pattern).test(inputValue)) {
      setErrorText(errorMessage || "Invalid input format.");
      setIsInvalid(true);
    } else {
      setErrorText("");
      setIsInvalid(false);
    }
  };

  const handleBlur = (event) => {
    validateInput(event.target.value);
  };

  return (
    <div aria-live="assertive">
      <label htmlFor={id} data-testid="text-input-label">{label}</label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e);
          validateInput(e.target.value); // Validate on input change as well
        }}
        onBlur={handleBlur}
        required={required}
        pattern={pattern}
        aria-required={required}
        aria-invalid={isInvalid ? "true" : "false"}
        aria-describedby={errorText ? `${id}-error` : ""}
        data-testid="text-input"
      />
      <p
        id={`${id}-error`}
        role="alert"
        aria-live="assertive"
        style={{
          color: "red",
          visibility: errorText ? "visible" : "hidden",
          height: errorText ? "auto" : "1px",
          overflow: "hidden",
        }}
        data-testid="text-input-error"
      >
        {errorText}
      </p>
    </div>
  );
};

export default TextInput;
