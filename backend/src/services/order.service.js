const pool = require("../config/db");

async function createOrder(customerInfo, items, foodService) {

    const { customer_name, phone, delivery_address } = customerInfo;

    let orderItems = [];
    let total = 0;

    for (const item of items) {

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return { error: "Quantity must be a positive number" };
        }

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

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const orderResult = await client.query(
            `INSERT INTO orders (customer_name, phone, delivery_address, total, status)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, customer_name, phone, delivery_address, total, status, created_at`,
            [customer_name, phone, delivery_address, total, "pending"]
        );

        const newOrder = orderResult.rows[0];

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
