const express = require("express");
const pool    = require("../config/db");

const router = express.Router();

// GET /api/health
// Returns API status and verifies database connectivity.
// Safe to expose publicly — no sensitive data is returned.
router.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.status(200).json({
      status:   "ok",
      api:      "running",
      database: "connected"
    });
  } catch (err) {
    console.error("Health check DB error:", err.message);
    return res.status(503).json({
      status:   "error",
      api:      "running",
      database: "unreachable"
    });
  }
});

module.exports = router;
