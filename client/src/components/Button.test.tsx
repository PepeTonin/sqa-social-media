import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("deve exibir carregamento e desabilitar o botão", () => {
    // Teste unitário de componente: valida o estado visual isolado do Button.
    render(<Button isLoading>Entrar</Button>);

    // Verifica se o texto do botão muda para "Carregando..." e se o botão fica desabilitado, conforme o estado isLoading.
    expect(screen.getByRole("button", { name: "Carregando..." })).toBeDisabled();
  });
});
