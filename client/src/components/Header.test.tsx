import { fireEvent, render, screen } from "@testing-library/react";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push: pushMock });
  });

  test("mostra botoes de entrar e criar conta para usuario deslogado", () => {
    // Teste unitario de componente: o Header e renderizado isoladamente
    // com o contexto de autenticacao mockado como deslogado.
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
    });

    render(<Header />);

    expect(screen.getByText("SQA Social Media")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Criar Conta" })
    ).toBeInTheDocument();
  });

  test("mostra posts curtidos e sair para usuario logado", () => {
    // Teste unitario de componente: agora simulamos usuario autenticado.
    // Isso valida a regra visual do cabecalho para usuarios logados.
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      logout: jest.fn(),
    });

    render(<Header />);

    expect(
      screen.getByRole("button", { name: "Posts Curtidos" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });

  test("clicar no titulo redireciona para a pagina principal", () => {
    // Teste pequeno de comportamento: confirma o requisito de navegacao do titulo.
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      logout: jest.fn(),
    });

    render(<Header />);
    fireEvent.click(screen.getByText("SQA Social Media"));

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
