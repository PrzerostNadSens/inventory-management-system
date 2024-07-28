import { matchedData } from 'express-validator';
import { CreateProductRequestDto } from '../dto/product';
import { ProductService } from '../services/productService';
import { StatusCodes } from 'http-status-codes';

import { NextFunction, Request, Response } from 'express';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const data = <CreateProductRequestDto>matchedData(req);

      const product = await this.productService.create(data);
      return res.status(StatusCodes.CREATED).send(product);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const recipes = await this.productService.get();
      return res.status(StatusCodes.OK).send(recipes);
    } catch (error) {
      next(error);
    }
  }

  async restockProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const productId = req.params.id;

      const product = await this.productService.restock(productId);
      return res.status(StatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  }

  async sellProduct(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const productId = req.params.id;

      const product = await this.productService.sell(productId);
      return res.status(StatusCodes.OK).send(product);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController(ProductService.getInstance());
