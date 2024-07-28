import { Router } from 'express';
import orderController from '../controllers/orderController';
import { validate } from '../middleware/validate.middleware';
import { validateCreateOrderRequest } from '../validators/order.validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Invalid input or insufficient stock
 */
router.post('/', validate(validateCreateOrderRequest), (req, res, next) => orderController.createOrder(req, res, next));

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerId
 *         - products
 *       properties:
 *         customerId:
 *           type: string
 *           description: The ID of the customer placing the order
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product
 *       example:
 *         customerId: "605c72ef16d4d87b8f7e69b8"
 *         products:
 *           - productId: "605c72ef16d4d87b8f7e69b9"
 *             quantity: 2
 */
