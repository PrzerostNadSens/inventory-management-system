import { CreateProductRequestDto, ProductDto } from '../../dto/product';

import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';

export const createProductRequest: CreateProductRequestDto = {
  name: faker.word.adjective(50),
  description: faker.word.adjective(50),
  price: faker.datatype.float({ min: 0 }),
  stock: faker.datatype.number({ min: 0 }),
};

export const productResponse: ProductDto = {
  id: new ObjectId().toString(),
  name: faker.word.adjective(50),
  description: faker.word.adjective(50),
  price: faker.datatype.float({ min: 0 }),
  stock: faker.datatype.number({ min: 1 }),
};

export const generateProduct = (id?: string, stock?: number): ProductDto => ({
  id: id ?? new ObjectId().toString(),
  name: faker.word.adjective(50),
  description: faker.word.adjective(50),
  price: faker.datatype.float({ min: 0 }),
  stock: stock ?? 10,
});

export const generateManyProduct = (count: number): ProductDto[] =>
  Array.from({ length: count }, () => generateProduct());
