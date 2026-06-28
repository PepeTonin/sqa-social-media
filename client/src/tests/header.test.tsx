import Header from "../components/Header";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: jest.fn(),
  }),
}));

describe("Header component", () => {
  test("navigates to signin page", () => {
    render(<Header />);
    const title = screen.getByText("SQA Social Media");
    fireEvent.click(title);
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  test("navigates to signin page", () => {
    render(<Header />);
    const loginButton = screen.getByRole("button", {name: "Entrar"});
    fireEvent.click(loginButton);
    expect(pushMock).toHaveBeenCalledWith("/signin");
  });

  test("navigates to signup page", () => {
    render(<Header />);
    const registerButton = screen.getByRole("button", {name: "Criar Conta"});
    fireEvent.click(registerButton);
    expect(pushMock).toHaveBeenCalledWith("/signup");
  });
});