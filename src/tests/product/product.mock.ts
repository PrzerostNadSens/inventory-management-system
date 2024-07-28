import { CreateProductRequestDto, ProductResponseDto } from '../../dto/product';

import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';

export const createProductRequest: CreateProductRequestDto = {
  name: faker.word.adjective(50),
  description: faker.word.adjective(50),
  price: faker.datatype.float({ min: 0 }),
  stock: faker.datatype.number({ min: 0 }),
};

export const productResponse: ProductResponseDto = {
  id: new ObjectId().toString(),
  name: faker.word.adjective(50),
  description: faker.word.adjective(50),
  price: faker.datatype.float({ min: 0 }),
  stock: faker.datatype.number({ min: 1 }),
};

export const generateProductResponse = (product?: Partial<ProductResponseDto>): ProductResponseDto => {
  return {
    id: new ObjectId().toString(),
    name: faker.word.adjective(50),
    description: faker.word.adjective(50),
    price: faker.datatype.float({ min: 0 }),
    stock: faker.datatype.number({ min: 1 }),
    ...product,
  };
};

export const generateManyProductResponses = (
  count: number,
  product?: Partial<ProductResponseDto>,
): ProductResponseDto[] => {
  return Array.from({ length: count }, () => generateProductResponse(product));
};
