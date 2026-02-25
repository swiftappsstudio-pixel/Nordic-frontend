


import express from "express";
import path from "path";
 import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import orderRoutes from "./routes/orderRoutes.js"
import swaggerUi from "swagger-ui-express";
import specs from "./config/swager.js";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(cors());
//images handling
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes);


// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;

