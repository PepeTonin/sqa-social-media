import { getEmailValidationMessage, isEmailValid } from "./email";

describe("utilitários de e-mail", () => {
  it("deve aceitar um e-mail válido", () => {
    // Teste unitário de sucesso: valida uma função pura, sem renderizar componentes.
    expect(isEmailValid("aluno@example.com")).toBe(true);
  });

  it("deve retornar mensagem para e-mail inválido", () => {
    // Teste unitário de bug/texto: o requisito espera uma mensagem legível em português.
    expect(getEmailValidationMessage("email-invalido")).toBe("Email inválido");
  });
});
