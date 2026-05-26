import { getEmailValidationMessage, isEmailValid } from "./email";

describe("email utils", () => {
  test("valida um email correto", () => {
    // Teste unitario de funcao pura: nao renderiza componente e nao usa API.
    // Ele garante que um email no formato esperado seja aceito.
    expect(isEmailValid("usuario@email.com")).toBe(true);
  });

  test("retorna mensagem para email invalido", () => {
    // Teste unitario de funcao pura: valida uma regra de negocio isolada.
    // Na apresentacao, da para explicar que isso evita regressao na validacao do formulario.
    expect(getEmailValidationMessage("email-invalido")).toBe("Email inv\u00e1lido");
  });
});
