const { Pool } = require("pg");
require("dotenv").config();

// SSL is required by most hosted PostgreSQL providers (e.g. Render, Railway, Supabase).
// Set DB_SSL=true in your production environment variables to enable it.
const sslEnabled = process.env.DB_SSL === "true";

const pool = new Pool({
    user:     process.env.DB_USER,
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port:     Number(process.env.DB_PORT) || 5432,
    ssl:      sslEnabled ? { rejectUnauthorized: false } : false
});

pool.on("error", (err) => {
    console.error("Unexpected database pool error:", err.message);
});

module.exports = pool;
