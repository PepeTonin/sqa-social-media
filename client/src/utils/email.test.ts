import { isEmailValid } from "./email";

/**
 * Teste UNITARIO de funcao pura (sem renderizacao).
 *
 * Requisito: o cadastro/login deve aceitar apenas e-mails validos. A
 * implementacao de isEmailValid usa um regex correto, portanto este teste deve
 * PASSAR (teste de regressao).
 */
describe("isEmailValid", () => {
  it("aceita e-mail valido e rejeita e-mails mal formados", () => {
    expect(isEmailValid("user@example.com")).toBe(true);
    expect(isEmailValid("user@")).toBe(false);
    expect(isEmailValid("@example.com")).toBe(false);
  });
});
