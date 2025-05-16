import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Button";

describe("Button Component", () => {
  // Test regular button rendering
  test("renders button with correct name", () => {
    render(<Button name="7" clickHandler={() => {}} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  // Test click handler
  test("calls clickHandler with button name when clicked", () => {
    const mockClickHandler = jest.fn();
    render(<Button name="8" clickHandler={mockClickHandler} />);

    fireEvent.click(screen.getByText("8"));
    expect(mockClickHandler).toHaveBeenCalledWith("8");
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });

  // Test orange styling
  test("applies orange class when orange prop is true", () => {
    render(<Button name="+" orange clickHandler={() => {}} />);
    const buttonContainer = screen.getByText("+").closest(".component-button");
    expect(buttonContainer).toHaveClass("orange");
  });

  // Test wide styling
  test("applies wide class when wide prop is true", () => {
    render(<Button name="0" wide clickHandler={() => {}} />);
    const buttonContainer = screen.getByText("0").closest(".component-button");
    expect(buttonContainer).toHaveClass("wide");
  });

  // Test both orange and wide styling
  test("applies both orange and wide classes when both props are true", () => {
    render(<Button name="=" orange wide clickHandler={() => {}} />);
    const buttonContainer = screen.getByText("=").closest(".component-button");
    expect(buttonContainer).toHaveClass("orange");
    expect(buttonContainer).toHaveClass("wide");
  });

  // Test default props
  test("does not apply orange or wide classes by default", () => {
    render(<Button name="1" clickHandler={() => {}} />);
    const buttonContainer = screen.getByText("1").closest(".component-button");
    expect(buttonContainer).not.toHaveClass("orange");
    expect(buttonContainer).not.toHaveClass("wide");
  });
});
