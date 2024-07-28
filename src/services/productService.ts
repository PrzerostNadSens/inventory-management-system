import { CreateProductRequestDto, ProductResponseDto } from '../dto/product';

import HttpException from '../exceptions/httpException';
import { ProductDao } from '../dao/product.dao';
import { StatusCodes } from 'http-status-codes';

export class ProductService {
  private static instance: ProductService;

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService(new ProductDao());
    }

    return ProductService.instance;
  }
  constructor(private readonly dao: ProductDao) {}

  async create(resource: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.dao.createProduct(resource);
  }
  async getProductById(productId: string): Promise<ProductResponseDto> {
    const product = await this.dao.getProductById(productId);

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product with this id does not exist');
    }
    return product;
  }

  async get(): Promise<ProductResponseDto[]> {
    return this.dao.getAllProducts();
  }

  async restock(productId: string): Promise<ProductResponseDto | null> {
    await this.getProductById(productId);

    return this.dao.updateStock(productId, 1);
  }

  async sell(productId: string): Promise<ProductResponseDto | null> {
    const product = await this.getProductById(productId);

    if (product.stock <= 0) {
      throw new HttpException(StatusCodes.FORBIDDEN, `The product stock cannot decrease below zero`);
    }
    return this.dao.updateStock(productId, -1);
  }
}
