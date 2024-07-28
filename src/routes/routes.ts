import express, { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import swaggerDocs from '../docs/swagger';
import swaggerUi from 'swagger-ui-express';

export const routes = express();

routes.get('/', (req: Request, res: Response) =>
  res.send('API documentation for the inventory management system - Rafał Chmielewski'),
);

routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

routes.use('*', (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    message: `Make sure url is correct!`,
  });
});
