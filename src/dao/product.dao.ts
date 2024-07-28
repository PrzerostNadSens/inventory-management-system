import { CreateProductRequestDto, ProductResponseDto } from '../dto/product';

import { Product } from '../models/product';

export class ProductDao {
  async createProduct(createProductBody: CreateProductRequestDto): Promise<ProductResponseDto> {
    const productToSave = new Product(createProductBody);

    return await productToSave.save();
  }

  async getAllProducts(): Promise<ProductResponseDto[]> {
    return Product.find();
  }
}
