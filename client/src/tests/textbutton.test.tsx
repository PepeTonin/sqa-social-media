import TextButton from "../components/TextButton";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("TextButton component", () => {
  test("renders with children", () => {
    render(<TextButton>Teste teste teste</TextButton>);
    const buttonElement = screen.getByText("Teste teste teste");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveStyle("color: var(--primary)");
    expect(buttonElement).toHaveStyle("cursor: pointer");
    expect(buttonElement).toHaveStyle("text-decoration: underline");
  });
});