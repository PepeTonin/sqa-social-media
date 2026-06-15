import { getUser, saveUser, StoredUser } from "@/lib/localStorage";

describe("persistência do usuário", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("deve recuperar o mesmo usuário que foi salvo", () => {
    // Arrange
    const user: StoredUser = {
      id: 42,
      email: "usuario@example.com",
    };

    // Act
    saveUser(user);
    const storedUser = getUser();

    // Assert
    // BUG DOCUMENTADO: o usuário salvo deveria ser recuperado pela mesma chave.
    expect(storedUser).toEqual(user);
  });
});
