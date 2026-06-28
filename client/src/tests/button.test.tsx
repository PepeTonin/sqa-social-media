import Button from "../components/Button";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Button component", () => {
  test("renders with default variant", () => {
    render(<Button variant="primary" isLoading={false}>Primary</Button>);
    const buttonElement = screen.getByText("Primary");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveStyle("background: var(--primary)");
  });

  test("renders with secondary variant", () => {
    render(<Button variant="secondary" isLoading={false}>Secondary</Button>);
    const buttonElement = screen.getByText("Secondary");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveStyle("background: var(--secondary)");
  });

  test("renders with outline variant", () => {
    render(<Button variant="outline" isLoading={false}>Outline</Button>);
    const buttonElement = screen.getByText("Outline");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveStyle("background: transparent");
    expect(buttonElement).toHaveStyle("border: 1px solid var(--border)");
  });

    test("renders with isLoading state", () => {
      render(<Button isLoading={true}>Loading</Button>);
      const buttonElement = screen.getByText("Carregando...");
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toBeDisabled();
    });

  test("renders with disabled state", () => {
    render(<Button disabled={true} isLoading={false}>Disabled</Button>);
    const buttonElement = screen.getByRole("button", { name: "Disabled" });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
  });
});