import { CreateProductRequestDto, ProductResponseDto } from '../dto/product';

import { Product } from '../models/product';

export class ProductDao {
  async createProduct(createProductBody: CreateProductRequestDto): Promise<ProductResponseDto> {
    const productToSave = new Product(createProductBody);

    return productToSave.save();
  }

  async getProductById(productId: string): Promise<ProductResponseDto | null> {
    return Product.findById(productId);
  }

  async getAllProducts(): Promise<ProductResponseDto[]> {
    return Product.find();
  }

  async updateStock(productId: string, amount: number): Promise<ProductResponseDto | null> {
    return Product.findByIdAndUpdate(
      productId,
      {
        $inc: { stock: amount },
      },
      { new: true },
    );
  }
}
