import { validateCreateProduct, validateMongoId } from '../validators/product.validate';

import { Router } from 'express';
import productController from '../controllers/productController';
import { validate } from '../middleware/validate.middleware';

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
 *                   "name": "iPhone 12",
 *                   "description": "Latest Apple smartphone",
 *                   "price": 999.99,
 *                   "stock": 10,
 *                   "id": "61375660ea9b4c173094211c"
 *                 }
 *       400:
 *         description: Validation error. Check the response body for details.
 *       500:
 *         description: Internal server error.
 *
 */

router.post('/', validate(validateCreateProduct), (req, res, next) => productController.createProduct(req, res, next));

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - product
 *     description: displays products
 *     produces:
 *       - application/json
 *
 *     responses:
 *       200:
 *         description: Products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *
 *                     [
 *                       {
 *                       "name": "iPhone 12",
 *                       "description": "Latest Apple smartphone",
 *                       "price": 999.99,
 *                       "stock": 10,
 *                       "id": "61375660ea9b4c173094211c"
 *                        },
 *                       {
 *                       "name": "iPhone 11",
 *                       "description": "Apple smartphone",
 *                       "price": 999,
 *                       "stock": 1,
 *                       "id": "6137564c173094211c60ea9b"
 *                        }
 *                     ]
 *
 *       500:
 *         description: Internal server error.
 */

router.get('/', (req, res, next) => productController.getProducts(req, res, next));

/**
 * @swagger
 * /products/{id}/restock:
 *   post:
 *     tags:
 *       - product
 *     description: Increase the stock level of a product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to restock
 *     responses:
 *       200:
 *         description: Stock level updated successfully
 *       400:
 *         description: Validation error. Check the response body for details.
 *       500:
 *         description: Internal server error.
 */

router.post('/:id/restock', validate(validateMongoId), (req, res, next) =>
  productController.restockProduct(req, res, next),
);

/**
 * @swagger
 * /products/{id}/sell:
 *   post:
 *     tags:
 *       - product
 *     description: Decrease the stock level of a product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to sell
 *     responses:
 *       200:
 *         description: Stock level updated successfully
 *       400:
 *         description: Validation error. Check the response body for details.
 *       500:
 *         description: Internal server error.
 */

router.post('/:id/sell', validate(validateMongoId), (req, res, next) => productController.sellProduct(req, res, next));

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
