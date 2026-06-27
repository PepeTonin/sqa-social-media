import { isPasswordValid } from "./password";

describe("utilitários de senha", () => {
  it("deve aceitar senha forte com exatamente oito caracteres", () => {
    // Teste unitário de bug: o requisito diz "mínimo 8 caracteres".
    // A implementação do frontend usa maior que 8, então este teste deve falhar.
    expect(isPasswordValid("Abc123!@")).toBe(true);
  });
});
