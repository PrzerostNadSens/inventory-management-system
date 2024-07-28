import { ValidationChain, body, param } from 'express-validator';

const messageString = 'Field must be a string';
const messageFloat = 'Field must be a float';
const messageInt = 'Field must be a int';
const messageMongoId = 'Field must by mongoId';
const messageIsLength50 = 'Field must exceed 50 characters';

const validateProductId = param('id').isMongoId().withMessage(messageMongoId);

export const validateMongoId: ValidationChain[] = [validateProductId];

const validateNameRequired = body('name')
  .isString()
  .withMessage(messageString)
  .isLength({ max: 50 })
  .withMessage(messageIsLength50);

const validateDescriptionRequired = body('description')
  .isString()
  .withMessage(messageString)
  .isLength({ max: 50 })
  .withMessage(messageIsLength50);

const validatePriceRequired = body('price').isFloat({ min: 0 }).withMessage(messageFloat);

const validateStockRequired = body('stock').isInt({ min: 0 }).withMessage(messageInt);

export const validateCreateProduct: ValidationChain[] = [
  validateNameRequired,
  validateDescriptionRequired,
  validatePriceRequired,
  validateStockRequired,
];
