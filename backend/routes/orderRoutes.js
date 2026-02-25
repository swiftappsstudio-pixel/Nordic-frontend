import express from "express";
import { createOrder, getOrders, deleteOrder } from "../controllers/orderController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (no login required)
 *     description: Guests can submit service requests without logging in. If a Bearer token is provided, the order is linked to the user.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *       - {}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               serviceName:
 *                 type: string
 *                 example: Home Care
 *               price:
 *                 type: number
 *                 example: 100
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               date:
 *                 type: string
 *                 example: "2026-03-01"
 *               time:
 *                 type: string
 *                 example: "10:00"
 *               paymentMethod:
 *                 type: string
 *                 example: cash
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500:
 *         description: Server error
 */
router.post("/", optionalAuth, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders (sorted by newest first)
 *       500:
 *         description: Server error
 */
router.get("/", getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteOrder);

export default router;
