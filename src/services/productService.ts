import { CreateProductRequestDto, ProductDto } from '../dto/product';

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

  async create(resource: CreateProductRequestDto): Promise<ProductDto> {
    return this.dao.createProduct(resource);
  }
  async getProductById(productId: string): Promise<ProductDto> {
    const product = await this.dao.getProductById(productId);

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'Product with this id does not exist');
    }
    return product;
  }

  async get(): Promise<ProductDto[]> {
    return this.dao.getAllProducts();
  }

  async restock(productId: string): Promise<ProductDto | null> {
    await this.getProductById(productId);

    return this.dao.updateStock(productId, 1);
  }

  async sell(productId: string): Promise<ProductDto | null> {
    const product = await this.getProductById(productId);

    if (product.stock <= 0) {
      throw new HttpException(StatusCodes.FORBIDDEN, `The product stock cannot decrease below zero`);
    }
    return this.dao.updateStock(productId, -1);
  }

  async updateStock(productId: string, quantity: number): Promise<ProductDto | null> {
    const product = await this.getProductById(productId);

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new HttpException(StatusCodes.FORBIDDEN, 'The product stock cannot decrease below zero');
    }

    return this.dao.updateStock(productId, quantity);
  }
}
