// Load .env for local runs (CI sets the variables itself). Never fails if .env is missing.
try {
 process.loadEnvFile(".env");
} catch {
 // no .env file: fine
}