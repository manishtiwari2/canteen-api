import { Router } from "express";
import { orderTotal } from "./price.js";
export function ordersRouter(db) {
 const router = Router();
 // POST /orders {userId, items: [{name, price, qty}]} -> 201 {id, total}
 router.post("/", async (req, res) => {
 const { userId, items } = req.body ?? {};
 if (!Number.isInteger(userId)) return res.status(400).json({ error: "userId is required" });
 if (!Array.isArray(items) || items.length === 0) {
 return res.status(400).json({ error: "items are required" });
 }
 const total = orderTotal(items);
 const { rows } = await db.query(
 `INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3)
 RETURNING id, total`,
 [userId, JSON.stringify(items), total],
 );
 res.status(201).json({ id: rows[0].id, total: Number(rows[0].total) });
 });
 // GET /orders/:id -> 200 order, or 404
 router.get("/:id", async (req, res) => {
 const { rows } = await db.query(
 "SELECT id, user_id, items, total FROM orders WHERE id = $1",
 [Number(req.params.id)],
 );
 if (!rows[0]) return res.status(404).json({ error: "order not found" });
 res.json({ ...rows[0], total: Number(rows[0].total) });
 });
 return router;
}