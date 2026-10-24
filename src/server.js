import { createApp } from "./app.js";
import { config } from "./config.js";
const app = createApp();
// 0.0.0.0 = listen on every interface. Inside a container this is required,
// otherwise the published port (-p) has nothing to connect to.
const server = app.listen(config.port, "0.0.0.0", () => {
 console.log(`canteen-api listening on ${config.port}`);
});
// `docker stop` sends SIGTERM to PID 1. Without this handler Node ignores it,
// Docker waits 10 seconds and then kills the process (exit code 137).
process.on("SIGTERM", () => {
 console.log("SIGTERM received, shutting down");
 server.close(() => process.exit(0));
});