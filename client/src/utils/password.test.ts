import { isPasswordValid } from "./password";

/**
 * Teste UNITARIO de funcao pura (sem renderizacao) — captura de BUG.
 *
 * Requisito: "A senha deve ter no minimo 8 caracteres". A implementacao usa a
 * condicao `password.length <= 8` (erro de limite — deveria ser `< 8`),
 * rejeitando senhas validas de exatamente 8 caracteres.
 *
 * "Senha@12" tem 8 caracteres, com maiuscula, minuscula, numero e especial,
 * logo deveria ser valida. Este teste FALHA na implementacao atual, provando o
 * bug.
 */
describe("isPasswordValid", () => {
  it("[BUG] aceita senha forte de exatamente 8 caracteres (minimo permitido)", () => {
    expect(isPasswordValid("Senha@12")).toBe(true);
  });
});
