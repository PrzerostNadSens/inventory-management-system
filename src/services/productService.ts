import { CreateProductRequestDto } from '../dto/product/createProductRequest.dto';
import { CreateProductResponseDto } from '../dto/product/createProductResponse.dto';
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

  async create(resource: CreateProductRequestDto): Promise<CreateProductResponseDto> {
    return this.dao.createProduct(resource);
  }
}
