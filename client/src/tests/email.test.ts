import { isEmailValid } from "../utils/email";

describe("isEmailValid", () => {
  test("should return false for empty email", () => {
    expect(isEmailValid("")).toBe(false);
  });
  
  test("should return false for email without @", () => {
    expect(isEmailValid("testemail.com")).toBe(false);
  });

  test("should return false for email without domain", () => {
    expect(isEmailValid("test@")).toBe(false);
  });

  test("should return true for valid email", () => {
    expect(isEmailValid("test@gmail.com")).toBe(true);
  });

});