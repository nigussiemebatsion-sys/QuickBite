// dotenv is loaded by server.js before this module is required.
// Do NOT call require("dotenv").config() here — it would use
// process.cwd() which varies depending on how the server is started.

const { Pool } = require("pg");

// SSL is required by Neon and most hosted PostgreSQL providers.
// Set DB_SSL=true in your environment variables for production.
const sslEnabled = process.env.DB_SSL === "true";

const pool = new Pool({
    user:             process.env.DB_USER,
    host:             process.env.DB_HOST,
    database:         process.env.DB_NAME,
    password:         process.env.DB_PASSWORD,
    port:             Number(process.env.DB_PORT) || 5432,
    ssl:              sslEnabled ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,  // Fail fast if connection hangs
    idleTimeoutMillis:       30000,  // Release idle connections after 30s
    max:              20             // Max pool size
});

pool.on("error", (err) => {
    console.error("Unexpected database pool error:", err.message);
});

module.exports = pool;
