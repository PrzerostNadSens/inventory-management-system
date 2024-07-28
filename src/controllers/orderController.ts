import { matchedData } from 'express-validator';
import { OrderService } from '../services/orderService';
import { StatusCodes } from 'http-status-codes';

import { NextFunction, Request, Response } from 'express';
import { CreateOrderRequestDto } from '../dto/order';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = <CreateOrderRequestDto>matchedData(req);

      const orderId = await this.orderService.create(data);
      return res.status(StatusCodes.ACCEPTED).send(orderId);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController(OrderService.getInstance());
