import { CreateProductRequestDto } from '../../dto/product/createProductRequest.dto';
import { CreateProductResponseDto } from '../../dto/product/createProductResponse.dto';
import { faker } from '@faker-js/faker';

export const createProductRequest: CreateProductRequestDto = {
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  price: faker.datatype.float(),
  stock: faker.datatype.number(),
};

export const createProductResponse: CreateProductResponseDto = {
  id: faker.datatype.uuid(),
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  price: faker.datatype.float(),
  stock: faker.datatype.number(),
};
