const express = require("express");
const cors    = require("cors");

const foodRoutes  = require("./routes/food.routes");
const orderRoutes = require("./routes/order.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

const devOrigins = [
  "http://localhost:5500",
  "http://localhost:5501",
  "http://localhost:5502",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const productionOrigin = process.env.FRONTEND_URL;

const allowedOrigins = productionOrigin
  ? [...devOrigins, productionOrigin]
  : devOrigins;

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use("/api/health", healthRoutes);
app.use("/api/foods",  foodRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ status: "Error", message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ status: "Error", message: "Internal server error" });
});

module.exports = app;
