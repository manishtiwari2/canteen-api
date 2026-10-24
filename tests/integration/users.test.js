import { test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { freshTestDb } from "../helpers/testDb.js";
let db, app;
beforeAll(async () => {
 db = await freshTestDb();
 app = createApp({ db });
});
afterAll(async () => db.end());
const newUser = { email: "asha@example.com", name: "Asha", password: "correcthorse" };
test("creates a user", async () => {
 const res = await request(app).post("/users").send(newUser);
 expect(res.status).toBe(201);
 expect(res.body.email).toBe("asha@example.com");
});
test("rejects a short password with 400", async () => {
 const shortPassword = { ...newUser, email: "x@example.com", password: "abc" };
 const res = await request(app).post("/users").send(shortPassword);
 expect(res.status).toBe(400);
});
