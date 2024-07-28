import { CreateProductRequestDto, ProductDto } from '../dto/product';

import { Product } from '../models/product';

export class ProductDao {
  async createProduct(createProductBody: CreateProductRequestDto): Promise<ProductDto> {
    const productToSave = await Product.create(createProductBody);

    return { ...productToSave, id: productToSave._id };
  }

  async getProductById(productId: string): Promise<ProductDto | null> {
    return Product.findById(productId);
  }

  async getAllProducts(): Promise<ProductDto[]> {
    return Product.find();
  }

  async updateStock(productId: string, amount: number): Promise<ProductDto | null> {
    return Product.findByIdAndUpdate(
      productId,
      {
        $inc: { stock: amount },
      },
      { new: true },
    );
  }
}
