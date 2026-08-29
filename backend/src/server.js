require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const app  = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

async function verifyDatabaseConnection() {
    try {
        const result = await pool.query(
            "SELECT current_database() AS db, current_user AS usr"
        );
        const { db, usr } = result.rows[0];
        console.log(`Database : connected to "${db}" as "${usr}"`);
        console.log(`SSL      : ${process.env.DB_SSL === "true" ? "enabled" : "disabled"}`);
        console.log(`Host     : ${process.env.DB_HOST || "not set"}`);
    } catch (err) {
        console.error("Database : connection FAILED —", err.message);
        console.error("Check DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, DB_PORT, DB_SSL in .env");
        process.exit(1);
    }
}

app.listen(PORT, async () => {
    console.log(`Server   : running on PORT ${PORT}`);
    await verifyDatabaseConnection();
});
