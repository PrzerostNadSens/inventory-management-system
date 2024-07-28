import { CreateProductRequestDto, ProductResponseDto } from '../dto/product';

import { ProductDao } from '../dao/product.dao';

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

  async get(): Promise<ProductResponseDto[]> {
    return this.dao.getAllProducts();
  }
}
