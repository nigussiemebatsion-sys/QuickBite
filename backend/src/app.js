const express = require("express");
const cors = require("cors");

const foodRoutes = require("./routes/food.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5500",
  "http://localhost:5501",
  "http://localhost:5502",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;