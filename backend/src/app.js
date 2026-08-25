const express = require("express");

const foodRoutes = require("./routes/food.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());

app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;