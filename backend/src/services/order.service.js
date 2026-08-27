const orders = [];

// Creates a new order from the items sent by the customer.
//
// Parameters:
// - items: the list of foods the customer wants to order.
//          Example: [{ foodId: 1, quantity: 2 }]
//
// - foodService: the food service object.
//                We receive it so we can use functions such as
//                foodService.getFoodById() to find the actual food.

function createOrder(items, foodService) {

    // Stores the complete information about each food item
    // in the customer's order.
    let orderItems = [];

    // Stores the total price of the entire order.
    let total = 0;

    // Go through each item sent by the customer.
    //
    // "items" = the whole array
    // "item"  = one object from that array
    //
    // Example:
    // items = [
    //   { foodId: 1, quantity: 2 },
    //   { foodId: 2, quantity: 1 }
    // ]
    //
    // First loop:
    // item = { foodId: 1, quantity: 2 }
    //
    // Second loop:
    // item = { foodId: 2, quantity: 1 }

    for (const item of items) {

        // Make sure the quantity is a positive whole number.
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            return {
                error: "Quantity must be a positive number"
            };
        }

        // item.foodId gets the food ID sent by the customer.
        //
        // Example:
        // item.foodId = 2
        //
        // We pass 2 to getFoodById().
        //
        // getFoodById(2) searches the foods array and returns
        // the actual food object whose id is 2.
        const food = foodService.getFoodById(item.foodId);

        // If getFoodById() could not find the food,
        // it returns undefined.
        //
        // We stop creating the order and return an error.
        if (!food) {
            return {
                error: `Food with ID ${item.foodId} not found`
            };
        }

        // Make sure the customer cannot order a food
        // that is currently unavailable.
        if (!food.available) {
            return {
                error: `${food.name} is currently unavailable`
            };
        }

        // Calculate the price for this particular food.
        //
        // toFixed(2) rounds the value to 2 decimal places.
        // Number() converts the result back into a number.
        const itemTotal = Number(
            (food.price * item.quantity).toFixed(2)
        );

        // Add the processed food information to the order.
        //
        // We use the price from our food data instead of
        // trusting a price sent by the customer.
        orderItems.push({
            foodId: food.id,
            name: food.name,
            quantity: item.quantity,
            price: food.price,
            subtotal: itemTotal
        });

        // Add this item's subtotal to the total order price.
        total += itemTotal;
    }

    // Round the final order total to 2 decimal places.
    total = Number(total.toFixed(2));

    // Create the complete order object.
    const order = {

        // Generate a simple ID using the current number of orders.
        // NOTE: This is only suitable for our temporary
        // in-memory version. A database will generate IDs later.
        id: orders.length + 1,

        // Complete processed items in this order.
        items: orderItems,

        // Total price of all items.
        total: total,

        // Every new order starts with "pending" status.
        status: "pending"
    };

    // Save the order in the temporary orders array.
    orders.push(order);

    // Return the newly created order to the controller.
    return {
        order
    };
}


// Finds an existing order using its ID.
//
// GET /api/orders/2
//
// The controller gets id = 2 and calls:
// orderService.getOrderById(2)
//
// .find() checks each order until it finds
// an order whose ID matches the requested ID.

function getOrderById(id) {
    return orders.find(order => order.id === id);
}


// Export these functions so the controller can use them.
//
// The controller can now do:
//
// orderService.createOrder(...)
// orderService.getOrderById(...)

module.exports = {
    createOrder,
    getOrderById
};