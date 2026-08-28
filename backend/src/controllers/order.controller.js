const orderService = require("../services/order.service");
const foodService = require("../services/food.service");

async function createOrder(req, res) {
    try {
        console.log("REQUEST BODY:", req.body);

        const items = req.body.items;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: "Error",
                message: "Order must contain at least one item"
            });
        }

        const result = await orderService.createOrder(items, foodService);

        if (result.error) {
            return res.status(400).json({
                message: result.error
            });
        }

        return res.status(201).json({
            status: "Success",
            data: result.order
        });
    } catch (err) {
        console.error("createOrder error:", err);
        return res.status(500).json({
            status: "Error",
            message: "Failed to create order"
        });
    }
}

async function getOrderById(req, res) {
    try {
        const id = Number(req.params.id);
        const order = await orderService.getOrderById(id);

        if (!order) {
            return res.status(404).json({
                status: "Error",
                message: "Order not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            data: order
        });
    } catch (err) {
        console.error("getOrderById error:", err);
        return res.status(500).json({
            status: "Error",
            message: "Failed to fetch order"
        });
    }
}

module.exports = {
    createOrder,
    getOrderById
};
