import { matchedData } from 'express-validator';
import { CreateProductRequestDto } from '../dto/product/createProductRequest.dto';
import { ProductService } from '../services/productService';
import { StatusCodes } from 'http-status-codes';
import responses from '../exceptions/exceptions';

import { Request, Response } from 'express';

export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const data = <CreateProductRequestDto>matchedData(req);

      const product = await this.productService.create(data);
      return res.status(StatusCodes.CREATED).send(product);
    } catch (error) {
      return responses.sendInternalServerErrorResponse(res);
    }
  }
}

export default new ProductsController(ProductService.getInstance());
