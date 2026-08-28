const pool = require("../config/db");

// Creates a new order and persists it to PostgreSQL inside a transaction.
//
// Parameters:
// - customerInfo: { customer_name, phone, delivery_address }
// - items: array of { foodId, quantity }
// - foodService: used to validate foods and retrieve their current prices from DB

async function createOrder(customerInfo, items, foodService) {

    const { customer_name, phone, delivery_address } = customerInfo;

    // ── 1. Validate all items and calculate totals ──────────────────────────
    // Done before opening a transaction to avoid holding a client open during
    // async food lookups.

    let orderItems = [];
    let total = 0;

    for (const item of items) {

        // Quantity must be a positive integer.
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return { error: "Quantity must be a positive number" };
        }

        // Look up the food — price comes from DB, never from the client.
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
            name:   food.name,
            quantity: item.quantity,
            price:  food.price,
            subtotal: itemTotal
        });

        total += itemTotal;
    }

    total = Number(total.toFixed(2));

    // ── 2. Persist inside a transaction ────────────────────────────────────

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Insert the order row with customer info and return the generated id.
        const orderResult = await client.query(
            `INSERT INTO orders (customer_name, phone, delivery_address, total, status)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, customer_name, phone, delivery_address, total, status, created_at`,
            [customer_name, phone, delivery_address, total, "pending"]
        );

        const newOrder = orderResult.rows[0];

        // Insert each order item using the DB-generated order ID.
        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items (order_id, food_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [newOrder.id, item.foodId, item.quantity, item.price]
            );
        }

        await client.query("COMMIT");

        return {
            order: {
                id:               newOrder.id,
                customer_name:    newOrder.customer_name,
                phone:            newOrder.phone,
                delivery_address: newOrder.delivery_address,
                total:            Number(newOrder.total),
                status:           newOrder.status,
                created_at:       newOrder.created_at,
                items:            orderItems
            }
        };

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}


// Retrieves an order by ID with its items joined from foods.

async function getOrderById(id) {

    const orderResult = await pool.query(
        `SELECT id, customer_name, phone, delivery_address, total, status, created_at
         FROM orders
         WHERE id = $1`,
        [id]
    );

    if (orderResult.rows.length === 0) {
        return null;
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
        `SELECT
             oi.food_id                                        AS "foodId",
             f.name,
             oi.quantity,
             oi.price,
             CAST(oi.price * oi.quantity AS NUMERIC(10,2))    AS subtotal
         FROM order_items oi
         JOIN foods f ON f.id = oi.food_id
         WHERE oi.order_id = $1
         ORDER BY oi.id`,
        [id]
    );

    return {
        id:               order.id,
        customer_name:    order.customer_name,
        phone:            order.phone,
        delivery_address: order.delivery_address,
        total:            Number(order.total),
        status:           order.status,
        created_at:       order.created_at,
        items: itemsResult.rows.map(row => ({
            foodId:   row.foodId,
            name:     row.name,
            quantity: row.quantity,
            price:    Number(row.price),
            subtotal: Number(row.subtotal)
        }))
    };
}


module.exports = {
    createOrder,
    getOrderById
};
