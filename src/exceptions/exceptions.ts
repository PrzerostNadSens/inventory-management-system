import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class Responses {
  notFound(res: Response, source: string) {
    return res.status(StatusCodes.NOT_FOUND).send({ message: ` The ${source} with the given id does not exist.` });
  }

  sendInternalServerErrorResponse(res: Response) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
}

export default new Responses();
