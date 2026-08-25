const orders = [];

function createOrder(items, foodService) {
    let orderItems = [];
    let total = 0;

    for (const item of items) {

        const food = foodService.getFoodById(item.foodId);

        if (!food) {
            return {
                error: `Food with ID ${item.foodId} not found`
            };
        }

        if (!food.available) {
            return {
                error: `${food.name} is currently unavailable`
            };
        }

        const itemTotal = food.price * item.quantity;

        orderItems.push({
            foodId: food.id,
            name: food.name,
            quantity: item.quantity,
            price: food.price,
            subtotal: itemTotal
        });

        total += itemTotal;
    }

    const order = {
        id: orders.length + 1,
        items: orderItems,
        total: total,
        status: "pending"
    };

    orders.push(order);

    return {
        order
    };
}

module.exports = {
    createOrder
};