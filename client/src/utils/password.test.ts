import { isPasswordValid } from "@/utils/password";

describe("isPasswordValid", () => {
  it("bug: deve aceitar senha forte com exatamente 8 caracteres", () => {
    // Requisito: minimo 8 caracteres, com maiuscula, minuscula, numero e especial.
    // Hoje este teste falha porque a implementacao rejeita password.length <= 8.
    expect(isPasswordValid("Aa1@bbbb")).toBe(true);
  });
});
