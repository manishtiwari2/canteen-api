export function isValidEmail(email) {
 return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export const MIN_PASSWORD_LENGTH = 8;
export function validatePassword(password) {
 if (typeof password !== "string") return { valid: false, reason: "missing" };
 if (password.length >= MIN_PASSWORD_LENGTH) return { valid: true };
 return { valid: false, reason: "too short" };
}