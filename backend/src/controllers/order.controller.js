const orderService = require("../services/order.service");
const foodService = require("../services/food.service");

function createOrder(req, res) {

    console.log("REQUEST BODY:", req.body);

    const items = req.body.items;

    const result = orderService.createOrder(items, foodService);

    if (result.error) {
        return res.status(400).json({
            message: result.error
        });
    }

    return res.status(201).json({
        status: "Success",
        data: result.order
    });
}

module.exports = {
    createOrder
};