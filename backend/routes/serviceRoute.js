import express from "express";
import { updateService ,deleteService,createService ,getAllServices,getServiceById} from "../controllers/serviceController.js";
import { uploadServiceImages } from "../middlewares/upload.js"; // 👈 ADD THIS

const router = express.Router();

router.post(
  "/",
  uploadServiceImages.array("images", 3),
  createService
);

router.put(
  "/:id",
  uploadServiceImages.array("images", 3),
  updateService
);
/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */





/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update an existing service
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
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

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: delete an existing service
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
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

/**
 * @swagger
 * /api/services/:
 *   get:
 *     summary: Get an existing service
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
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

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get an existing service
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
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


router.post("/", createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);

router.delete("/:id", deleteService);
router.put("/:id", updateService);

export default router;