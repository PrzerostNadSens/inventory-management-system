import { CreateOrderRequestDto } from '../../dto/order';
import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';

export const createOrderRequest: CreateOrderRequestDto = {
  customerId: new ObjectId().toString(),
  products: [
    { id: new ObjectId().toString(), quantity: faker.datatype.number({ min: 1 }) },
    { id: new ObjectId().toString(), quantity: faker.datatype.number({ min: 1 }) },
  ],
};

export const generateOrder = (
  id?: string,
  customerId?: string,
  products?: { id: string; quantity: number }[],
): CreateOrderRequestDto => ({
  customerId: customerId ?? new ObjectId().toString(),
  products: products ?? [
    { id: new ObjectId().toString(), quantity: faker.datatype.number({ min: 1 }) },
    { id: new ObjectId().toString(), quantity: faker.datatype.number({ min: 1 }) },
  ],
});

export const generateManyOrder = (count: number): CreateOrderRequestDto[] =>
  Array.from({ length: count }, () => generateOrder());
