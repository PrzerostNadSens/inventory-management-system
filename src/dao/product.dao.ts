import { CreateProductRequestDto } from '../dto/product/createProductRequest.dto';
import { CreateProductResponseDto } from '../dto/product/createProductResponse.dto';
import { Product } from '../models/product';

export class ProductDao {
  async createProduct(createProductBody: CreateProductRequestDto): Promise<CreateProductResponseDto> {
    const productToSave = new Product(createProductBody);

    return await productToSave.save();
  }
}
