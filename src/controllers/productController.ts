import { matchedData } from 'express-validator';
import { CreateProductRequestDto } from '../dto/product';
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

  async getProducts(req: Request, res: Response): Promise<Response> {
    try {
      const recipes = await this.productService.get();

      return res.status(StatusCodes.OK).send(recipes);
    } catch (error) {
      return responses.sendInternalServerErrorResponse(res);
    }
  }

  async restockProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.id;
      let product = await this.productService.getProductById(productId);
      if (!product) {
        return responses.notFound(res, 'product');
      }

      product = await this.productService.restock(productId);
      return res.status(StatusCodes.OK).send(product);
    } catch (error) {
      return responses.sendInternalServerErrorResponse(res);
    }
  }

  async sellProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.id;

      let product = await this.productService.getProductById(productId);
      if (!product) {
        return responses.notFound(res, 'product');
      }

      if (product.stock <= 0) {
        return responses.forbiddenProductStockDecrease(res);
      }

      product = await this.productService.sell(productId);

      return res.status(StatusCodes.OK).send(product);
    } catch (error) {
      return responses.sendInternalServerErrorResponse(res);
    }
  }
}

export default new ProductsController(ProductService.getInstance());
