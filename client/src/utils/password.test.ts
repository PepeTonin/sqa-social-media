import { isPasswordValid } from "./password";

/**
 * Teste UNITARIO de funcao pura (sem renderizacao).
 *
 * Requisito: "A senha deve atender aos seguintes criterios: minimo 8
 * caracteres, 1 letra maiuscula, 1 letra minuscula, 1 numero e 1 caractere
 * especial."
 */
describe("isPasswordValid", () => {
  // ---------- Casos que ja funcionam (regressao) ----------

  it("rejeita senhas que nao atendem aos criterios", () => {
    expect(isPasswordValid("")).toBe(false);
    expect(isPasswordValid("abcdefghij")).toBe(false); // sem maiuscula/numero/especial
    expect(isPasswordValid("ABCDEFGHIJ")).toBe(false); // sem minuscula/numero/especial
    expect(isPasswordValid("Abcdefghij")).toBe(false); // sem numero/especial
  });

  it("aceita uma senha forte com mais de 8 caracteres", () => {
    expect(isPasswordValid("Senha@1234")).toBe(true);
  });

  // ---------- Teste de BUG (deve FALHAR) ----------

  /**
   * BUG capturado: o requisito exige "minimo 8 caracteres", ou seja, uma senha
   * com exatamente 8 caracteres que cumpra os demais criterios deve ser aceita.
   *
   * A implementacao usa a condicao `password.length <= 8` (erro de limite -
   * deveria ser `< 8`), rejeitando senhas validas de exatamente 8 caracteres.
   *
   * "Senha@12" tem 8 caracteres, com maiuscula, minuscula, numero e especial,
   * logo deveria ser valida. Este teste FALHA na implementacao atual, provando
   * o bug.
   */
  it("[BUG] aceita senha forte de exatamente 8 caracteres (minimo permitido)", () => {
    expect(isPasswordValid("Senha@12")).toBe(true);
  });
});
