import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SliderInput from "./SliderInput";

describe("SliderInput Component", () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    title: "Loan Amount", // Or `label`, depending on your prop naming
    value: 100000,
    min: 10000,
    max: 1000000,
    step: 1000,
    onChange: mockOnChange,
    unit: "₹",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title correctly", () => {
    render(<SliderInput {...defaultProps} />);
    
    expect(screen.getByText("Loan Amount")).toBeInTheDocument();
  });

  it("renders the MUI slider with the correct initial value attributes", () => {
    render(<SliderInput {...defaultProps} />);
    
    // Material-UI assigns the role="slider" by default to its Slider component
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    
    // Check if the initial value is registered in the DOM correctly
    expect(slider).toHaveAttribute("aria-valuenow", "100000");
    expect(slider).toHaveAttribute("aria-valuemin", "10000");
    expect(slider).toHaveAttribute("aria-valuemax", "1000000");
  });

  it("calls the onChange handler when the slider value changes", () => {
    render(<SliderInput {...defaultProps} />);
    
    const slider = screen.getByRole("slider");
    
    // Simulate a user dragging the slider to a new value
    fireEvent.change(slider, { target: { value: 500000 } });
    
    expect(mockOnChange).toHaveBeenCalled();
    
    // Since we don't know the exact signature of your onChange (e.g. `onChange(e, val)` vs `onChange(val)`),
    // we just ensure it gets invoked. You can make this stricter if you know the exact argument signature:
    // expect(mockOnChange).toHaveBeenCalledWith(expect.anything(), 500000);
  });
});