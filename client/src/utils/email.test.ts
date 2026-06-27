import { isEmailValid } from "@/utils/email";

describe("isEmailValid", () => {
  it("deve validar emails corretos e rejeitar emails invalidos", () => {
    // Teste unitario puro: valida apenas uma funcao, sem renderizar componentes.
    expect(isEmailValid("usuario@email.com")).toBe(true);
    expect(isEmailValid("email-invalido")).toBe(false);
    expect(isEmailValid("")).toBe(false);
  });
});
