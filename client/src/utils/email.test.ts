import { isEmailValid, getEmailValidationMessage } from "./email";

/**
 * Teste UNITARIO de funcao pura (sem renderizacao).
 *
 * Valida o requisito de que o cadastro/login deve aceitar apenas e-mails
 * validos. A implementacao de isEmailValid no frontend usa um regex correto,
 * portanto estes testes devem PASSAR (teste de regressao).
 */
describe("isEmailValid", () => {
  it("aceita e-mails bem formados", () => {
    expect(isEmailValid("user@example.com")).toBe(true);
    expect(isEmailValid("  user@example.com  ")).toBe(true); // faz trim
  });

  it("rejeita e-mails mal formados", () => {
    expect(isEmailValid("")).toBe(false);
    expect(isEmailValid("semarroba")).toBe(false);
    expect(isEmailValid("user@")).toBe(false);
    expect(isEmailValid("user@semtld")).toBe(false);
    expect(isEmailValid("@example.com")).toBe(false);
  });

  it("retorna mensagem adequada conforme o estado do campo", () => {
    expect(getEmailValidationMessage("")).toBe("Email é obrigatório");
    expect(getEmailValidationMessage("invalido")).toBe("Email inválido");
    expect(getEmailValidationMessage("user@example.com")).toBe("");
  });
});
