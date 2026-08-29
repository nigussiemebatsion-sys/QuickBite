const express = require("express");
const pool    = require("../config/db");

const router = express.Router();

// GET /api/health
// Verifies API is running and database is reachable.
// Runs a real query to confirm connectivity — not just a ping.
// Safe to expose publicly: never returns passwords or secrets.
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT current_database() AS db, current_user AS usr"
        );
        const { db, usr } = result.rows[0];
        return res.status(200).json({
            status:   "ok",
            api:      "running",
            database: "connected",
            db_name:  db,
            db_user:  usr
        });
    } catch (err) {
        console.error("Health check DB error:", err.message);
        return res.status(503).json({
            status:   "error",
            api:      "running",
            database: "unreachable",
            detail:   err.message
        });
    }
});

module.exports = router;
