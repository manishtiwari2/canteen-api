import express from "express";
// The app is built by a function, so tests can create their own copy.
export function createApp() {
 const app = express();
 app.use(express.json());
 app.get("/health", (req, res) => res.send("ok"));
 return app;
}