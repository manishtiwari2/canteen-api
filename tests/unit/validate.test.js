import { test, expect } from "vitest";
import { isValidEmail, validatePassword } from "../../src/users/validate.js";

test("accepts a normal email", () => {
    // Arrange
    const email = "user@example.com";
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(true);
});

test("rejects an email without @", () => {
    expect(isValidEmail("user.example.com")).toBe(false);
});

test("accepts a password of normal length", () => {
    expect(validatePassword("correcthorse").valid).toBe(true);
});

test("rejects a password one character below the minimum", () => {
    expect(validatePassword("abcdefg").valid).toBe(false); // 7 chars
});

test("accepts a password of normal length", () => {
    expect(validatePassword("abcedefgh").valid).toBe(true);
});

test("reject a missing password", () =>  {
    expect(validatePassword(undefined).valid).toBe(false);
});
