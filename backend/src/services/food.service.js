const pool = require("../config/db");

async function getAllFoods() {
    const result = await pool.query(
        "SELECT * FROM foods ORDER BY id"
    );

    return result.rows;
}

async function getFoodById(id) {
    const result = await pool.query(
        "SELECT * FROM foods WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

module.exports = {
    getAllFoods,
    getFoodById
};