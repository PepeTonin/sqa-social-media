import { getEmailValidationMessage, isEmailValid } from "@/utils/email";

describe("validação de e-mail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test.each([
    ["usuario@example.com", true],
    ["usuario@", false],
    ["", false],
    ["usuario @example.com", false],
    ["usuario.example.com", false],
  ])("deve validar %p como %p", (email, expected) => {
    // Arrange + Act
    const valid = isEmailValid(email);

    // Assert
    expect(valid).toBe(expected);
  });

  test("deve informar quando o e-mail está vazio ou inválido", () => {
    // Arrange + Act + Assert
    expect(getEmailValidationMessage("")).toBe("Email é obrigatório");
    expect(getEmailValidationMessage("formato-invalido")).toBe(
      "Email inválido"
    );
  });
});
