import { Router } from "express";
import { createHash, randomBytes } from "node:crypto";
import { isValidEmail, validatePassword } from "./validate.js";
function hashPassword(password) {
 const salt = randomBytes(8).toString("hex");
 return salt + ":" + createHash("sha256").update(salt + password).digest("hex");
}
export function usersRouter(db) {
 const router = Router();
 // POST /users {email, name, password} -> 201 {id, email, name}
 router.post("/", async (req, res) => {
 const { email, name, password } = req.body ?? {};
 if (!isValidEmail(email)) return res.status(400).json({ error: "invalid email" });
 if (!name) return res.status(400).json({ error: "name is required" });
 const pw = validatePassword(password);
 if (!pw.valid) return res.status(400).json({ error: `password ${pw.reason}` });
 const { rows } = await db.query(
 `INSERT INTO users (email, user_name, password_hash) VALUES ($1, $2, $3)
 RETURNING id, email, user_name AS name`,
 [email.toLowerCase(), name, hashPassword(password)],
 );
 res.status(201).json(rows[0]);
 });
 return router;
}
