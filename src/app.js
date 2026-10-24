import express from "express";
import { usersRouter } from "./users/routes.js";
import { ordersRouter } from "./orders/routes.js";
// The app is built from its dependencies, so tests can pass in a test database.
export function createApp({ db }) {
 const app = express();
 app.use(express.json());
 app.get("/health", (req, res) => res.send("ok"));
 app.use("/users", usersRouter(db));
 app.use("/orders", ordersRouter(db));
 app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
 console.error(err);
 res.status(500).json({ error: "internal error" });
 });
 return app;
}