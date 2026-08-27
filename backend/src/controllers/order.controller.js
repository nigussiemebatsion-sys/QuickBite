const orderService = require("../services/order.service");
const foodService = require("../services/food.service");

function createOrder(req, res) {

    console.log("REQUEST BODY:", req.body);

    const items = req.body.items;
    if(!Array.isArray(items) || items.length === 0){
        return res.status(404).json({
            status:"Error",
            message:"Order must contain at least one item"
        });
    }

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
function getOrderById(req,res){
    const id = Number(req.params.id);

    const order = orderService.getOrderById(id);

    if(!order){
        return res.status(400).json({
            status:"Error",
            message:"Order not found"
        });
    }
    return res.status(200).json({
        status:"Success",
        data:order
    });
}

module.exports = {
    createOrder,
    getOrderById
};