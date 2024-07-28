import { ValidationChain, body } from 'express-validator';

const messageString = 'Field must be a string';
const messageInt = 'Field must be an integer';
const messageMongoId = 'Field must be a valid MongoDB ObjectId';

const validateProductId = body('products.*.id').isMongoId().withMessage(messageMongoId);

const validateProductQuantity = body('products.*.quantity').isInt({ min: 1 }).withMessage(messageInt);

const validateCustomerId = body('customerId')
  .isString()
  .withMessage(messageString)
  .isMongoId()
  .withMessage(messageMongoId);

export const validateCreateOrderRequest: ValidationChain[] = [
  validateCustomerId,
  validateProductId,
  validateProductQuantity,
];
