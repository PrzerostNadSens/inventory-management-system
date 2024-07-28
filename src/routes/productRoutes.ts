import { Router } from 'express';
import productsController from '../controllers/productController';
import { validate } from '../utils/validate';
import { validateCreateProduct } from '../validators/product.validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - product
 *     description: creating a product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: product
 *         schema:
 *           $ref: '#components/schemas/Product'
 *
 *     responses:
 *       201:
 *         description: Product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 {
 *                   "name": "Krewetki",
 *                   "description": "Obiad",
 *                   "price": 2.45,
 *                   "stock": 6,
 *                   "id": "61375660ea9b4c173094211c"
 *                 }
 *       400:
 *         description: Validation error. Check the response body for details.
 *
 */

router.post('/', validate(validateCreateProduct), (req, res) => productsController.createProduct(req, res));

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         stock:
 *           type: number
 *           description: The stock quantity of the product
 *       example:
 *         name: "Sample Product"
 *         description: "This is a sample product."
 *         price: 29.99
 *         stock: 100
 */
