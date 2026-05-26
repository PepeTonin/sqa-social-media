import { isPasswordValid } from "./password";

describe("password utils", () => {
  test("aceita senha forte com exatamente 8 caracteres", () => {
    // Teste de bug: o requisito diz que a senha deve ter no minimo 8 caracteres.
    // "Senha@12" tem exatamente 8 caracteres, maiuscula, minuscula, numero e especial.
    // Hoje este teste falha porque a funcao usa <= 8, exigindo mais de 8 caracteres.
    expect(isPasswordValid("Senha@12")).toBe(true);
  });

  test("rejeita senha sem caractere especial", () => {
    // Teste unitario de funcao pura que deve passar.
    // Ele confirma que a regra do caractere especial continua sendo exigida.
    expect(isPasswordValid("Senha123")).toBe(false);
  });
});
