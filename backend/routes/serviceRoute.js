import express from "express";
import { updateService, deleteService, createService, getAllServices, getServiceById } from "../controllers/serviceController.js";
import { uploadServiceImages } from "../middlewares/upload.js";

const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Service Title
 *               description:
 *                 type: string
 *                 example: Service Description
 *               actualPrice:
 *                 type: number
 *                 example: 100
 *               discountPrice:
 *                 type: number
 *                 example: 80
 *               category:
 *                 type: string
 *                 example: Category Name
 *               keyBenefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               keyIngredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               disclaimer:
 *                 type: string
 *               subServices:
 *                 type: string
 *                 description: JSON stringified array of sub-services
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 3 images
 *     responses:
 *       201:
 *         description: Service created successfully
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  uploadServiceImages.array("images", 3),
  createService
);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update an existing service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               actualPrice:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               category:
 *                 type: string
 *               keyBenefits:
 *                 type: array
 *                 items:
 *                   type: string
 *               keyIngredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               disclaimer:
 *                 type: string
 *               subServices:
 *                 type: string
 *                 description: JSON stringified array of sub-services
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 3 new images (replaces existing)
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Invalid service ID
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  uploadServiceImages.array("images", 3),
  updateService
);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of all services
 *       500:
 *         description: Server error
 */
router.get("/", getAllServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       400:
 *         description: Invalid service ID
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       400:
 *         description: Invalid service ID
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteService);

export default router;
