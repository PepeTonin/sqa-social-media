import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "../app/signup/page";
import { authService } from "@/service/auth/auth";

const pushMock = jest.fn();
const loginMock = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({
    push: pushMock,
  })
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: loginMock,
    logout: jest.fn(),
  }),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signUp: jest.fn(),
  },
}));

describe("SignUp Integration", () => {
  test("register successful", async () => {
    (authService.signUp as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@gmail.com",
    });
      render(<SignUp />);

      const email = "test@gmail.com";
      const password = "123456@Aa";

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Senha");
      const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
      const form = screen.getByRole("form", { name: "signup-form" });
      const submitButton = within(form).getByRole("button", { name: "Criar Conta" });

      fireEvent.change(emailInput, {target: { value: email },});
      fireEvent.change(passwordInput, {target: { value: password },});
      fireEvent.change(confirmPasswordInput, {target: { value: password },});

      fireEvent.click(submitButton);

      await waitFor(() => {expect(authService.signUp).toHaveBeenCalledWith({
        email: email,
        password: password,
      });

      expect(loginMock).toHaveBeenCalledWith({
        id: 1,
        email: email,
      });

      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  test("shows error message for invalid email", () => {
    render(<SignUp />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
    const form = screen.getByRole("form", { name: "signup-form" });
    const submitButton = within(form).getByRole("button", { name: "Criar Conta" });

    fireEvent.change(emailInput, {target: { value: "email-invalid@o" },});
    fireEvent.change(passwordInput, {target: { value: "123456@Aa" },});
    fireEvent.change(confirmPasswordInput, {target: { value: "123456@Aa" },});

    fireEvent.click(submitButton);

    expect(screen.getByText("Email inválido")).toBeInTheDocument();

  });

  test("shows error message for password mismatch", () => {
    render(<SignUp />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Senha");
    const confirmPasswordInput = screen.getByLabelText("Confirmar Senha");
    const form = screen.getByRole("form", { name: "signup-form" });
    const submitButton = within(form).getByRole("button", { name: "Criar Conta" });

    fireEvent.change(emailInput, {target: { value: "test@gmail.com" },});
    fireEvent.change(passwordInput, {target: { value: "123456@Aa" },});
    fireEvent.change(confirmPasswordInput, {target: { value: "654321@Aa" },});

    fireEvent.click(submitButton);

    expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
  });
});


