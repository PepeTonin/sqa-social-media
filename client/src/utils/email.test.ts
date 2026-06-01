import { getEmailValidationMessage, isEmailValid } from "./email";

// Funções puras
describe("email utils", () => {
  test("valida um email correto", () => {
    // Ele garante que um email no formato esperado seja aceito
    expect(isEmailValid("usuario@email.com")).toBe(true);
  });

  test("retorna mensagem para email invalido", () => {
    // Ele garante que a mensagem de e-mail inválido seja retornada corretamente
    expect(getEmailValidationMessage("email-invalido")).toBe("Email inv\u00e1lido");
  });
});
