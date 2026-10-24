import { test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { freshTestDb } from "../helpers/testDb.js";
let db, app, userId;
beforeAll(async () => {
 db = await freshTestDb();
 app = createApp({ db });
 const ravi = { email: "ravi@example.com", name: "Ravi", password: "correcthorse" };
 userId = (await request(app).post("/users").send(ravi)).body.id;
});
afterAll(async () => db.end());
test("places an order and reads it back", async () => {
 const order = { userId, items: [{ name: "dosa", price: 60, qty: 2 }] };
 const created = await request(app).post("/orders").send(order);
 expect(created.status).toBe(201);
 expect(created.body.total).toBe(120);
 const read = await request(app).get(`/orders/${created.body.id}`);
 expect(read.status).toBe(200);
 expect(read.body.items[0].name).toBe("dosa");
});
test("returns 404 for an unknown order", async () => {
 const res = await request(app).get("/orders/999999");
 expect(res.status).toBe(404);
});