import { ValidationChain, validationResult } from 'express-validator';

import { StatusCodes } from 'http-status-codes';
import express from 'express';

export const validate = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  };
};
