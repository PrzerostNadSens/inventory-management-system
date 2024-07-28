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

export const generateProductResponse = (id?: string, stock?: number): ProductResponseDto => ({
  id: id ?? new ObjectId().toString(),
  name: `Product ${id}`,
  description: 'Test Description',
  price: 100,
  stock: stock ?? 10,
});

export const generateManyProductResponses = (count: number): ProductResponseDto[] =>
  Array.from({ length: count }, (_, i) => generateProductResponse(`id${i}`, i * 10));
