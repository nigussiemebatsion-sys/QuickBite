const orderService = require("../services/order.service");
const foodService  = require("../services/food.service");

async function createOrder(req, res) {
    try {
        const { customer_name, phone, delivery_address, items } = req.body;

        if (!customer_name || !customer_name.trim()) {
            return res.status(400).json({
                status: "Error",
                message: "Customer name is required"
            });
        }

        if (!phone || !phone.trim()) {
            return res.status(400).json({
                status: "Error",
                message: "Phone number is required"
            });
        }

        if (!/^\d+$/.test(phone.trim())) {
            return res.status(400).json({
                status: "Error",
                message: "Phone number must contain digits only"
            });
        }

        if (!delivery_address || !delivery_address.trim()) {
            return res.status(400).json({
                status: "Error",
                message: "Delivery address is required"
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: "Error",
                message: "Order must contain at least one item"
            });
        }

        const customerInfo = {
            customer_name:    customer_name.trim(),
            phone:            phone.trim(),
            delivery_address: delivery_address.trim()
        };

        const result = await orderService.createOrder(customerInfo, items, foodService);

        if (result.error) {
            return res.status(400).json({
                status: "Error",
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
