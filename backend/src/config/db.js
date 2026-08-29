const { Pool } = require("pg");

const sslEnabled = process.env.DB_SSL === "true";

const pool = new Pool({
    user:             process.env.DB_USER,
    host:             process.env.DB_HOST,
    database:         process.env.DB_NAME,
    password:         process.env.DB_PASSWORD,
    port:             Number(process.env.DB_PORT) || 5432,
    ssl:              sslEnabled ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis:       30000,
    max:              20
});

pool.on("error", (err) => {
    console.error("Unexpected database pool error:", err.message);
});

module.exports = pool;
