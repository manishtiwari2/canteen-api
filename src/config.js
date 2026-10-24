// Config is an INPUT, not a constant (Twelve-Factor, Factor III).
// Every value comes from the environment; nothing secret is written here.
export const config = {
 port: Number(process.env.PORT ?? 3000),
 databaseUrl: process.env.DATABASE_URL,
};