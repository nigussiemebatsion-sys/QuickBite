const pool = require("../config/db");

// Creates a new order and persists it to PostgreSQL.
//
// Uses a transaction so that if inserting any order_item fails,
// the entire order is rolled back and nothing is left in the database.
//
// Parameters:
// - items: array of { foodId, quantity } objects sent by the customer
// - foodService: used to validate foods and retrieve their current prices

async function createOrder(items, foodService) {

    // ── 1. Validate all items and build the order data ──────────────────────
    // We do this BEFORE opening a transaction so we don't hold a DB client
    // open during validation logic.

    let orderItems = [];
    let total = 0;

    for (const item of items) {

        // Quantity must be a positive integer.
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return { error: "Quantity must be a positive number" };
        }

        // Look up the food in the database.
        const food = await foodService.getFoodById(item.foodId);

        if (!food) {
            return { error: `Food with ID ${item.foodId} not found` };
        }

        if (!food.available) {
            return { error: `${food.name} is currently unavailable` };
        }

        const itemTotal = Number((food.price * item.quantity).toFixed(2));

        orderItems.push({
            foodId: food.id,
            name: food.name,
            quantity: item.quantity,
            price: food.price,       // price from DB, never from the client
            subtotal: itemTotal
        });

        total += itemTotal;
    }

    total = Number(total.toFixed(2));

    // ── 2. Persist inside a transaction ────────────────────────────────────
    // Acquire a dedicated client from the pool so we can issue BEGIN/COMMIT.

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Insert the order row and return the generated id and created_at.
        const orderResult = await client.query(
            `INSERT INTO orders (total, status)
             VALUES ($1, $2)
             RETURNING id, total, status, created_at`,
            [total, "pending"]
        );

        const newOrder = orderResult.rows[0];

        // Insert each order item, now that we have the real order ID.
        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items (order_id, food_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [newOrder.id, item.foodId, item.quantity, item.price]
            );
        }

        await client.query("COMMIT");

        // Return the complete order object to the controller.
        return {
            order: {
                id: newOrder.id,
                total: Number(newOrder.total),
                status: newOrder.status,
                created_at: newOrder.created_at,
                items: orderItems
            }
        };

    } catch (err) {
        // Roll back the entire transaction if anything went wrong.
        await client.query("ROLLBACK");
        throw err;   // Re-throw so the controller catches it and returns 500.
    } finally {
        // Always release the client back to the pool.
        client.release();
    }
}


// Retrieves an order by its ID, including all associated order items
// with food names joined from the foods table.

async function getOrderById(id) {

    // Fetch the order row.
    const orderResult = await pool.query(
        `SELECT id, total, status, created_at
         FROM orders
         WHERE id = $1`,
        [id]
    );

    if (orderResult.rows.length === 0) {
        return null;
    }

    const order = orderResult.rows[0];

    // Fetch the order items, joining foods to get the food name.
    const itemsResult = await pool.query(
        `SELECT
             oi.id,
             oi.food_id   AS "foodId",
             f.name,
             oi.quantity,
             oi.price,
             CAST(oi.price * oi.quantity AS NUMERIC(10,2)) AS subtotal
         FROM order_items oi
         JOIN foods f ON f.id = oi.food_id
         WHERE oi.order_id = $1
         ORDER BY oi.id`,
        [id]
    );

    return {
        id: order.id,
        total: Number(order.total),
        status: order.status,
        created_at: order.created_at,
        items: itemsResult.rows.map(row => ({
            foodId: row.foodId,
            name: row.name,
            quantity: row.quantity,
            price: Number(row.price),
            subtotal: Number(row.subtotal)
        }))
    };
}


module.exports = {
    createOrder,
    getOrderById
};
