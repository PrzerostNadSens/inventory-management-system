import { CreateOrderRequestDto } from '../dto/order';
import HttpException from '../exceptions/httpException';
import { OrderDao } from '../dao/order.dao';
import { ProductDto } from '../dto/product';
import { ProductService } from './productService';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export class OrderService {
  private static instance: OrderService;

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService(new OrderDao());
    }

    return OrderService.instance;
  }

  constructor(private readonly dao: OrderDao, private readonly productService = ProductService.getInstance()) {}

  async create(resource: CreateOrderRequestDto): Promise<{ id: string }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    const aggregatedProducts = resource.products.reduce((acc, item) => {
      if (acc[item.id]) {
        acc[item.id] += item.quantity;
      } else {
        acc[item.id] = item.quantity;
      }
      return acc;
    }, {} as Record<string, number>);

    const orderedProducts = [];

    for (const [productId, quantity] of Object.entries(aggregatedProducts)) {
      const product = await this.productService.getProductById(productId);

      if (!product) {
        throw new HttpException(StatusCodes.NOT_FOUND, `Product with id ${productId} not found`);
      }

      if (product.stock < quantity) {
        throw new HttpException(StatusCodes.FORBIDDEN, `Insufficient stock for product ${productId}`);
      }

      orderedProducts.push({ productId, quantity });
    }

    const updatedProducts: ProductDto[] = [];

    for (const { productId, quantity } of orderedProducts) {
      const updatedProduct = await this.productService.updateStock(productId, -quantity);

      if (updatedProduct) {
        updatedProducts.push(updatedProduct);
      }
    }

    return this.dao.createOrder(resource.customerId, orderedProducts);
  }
}
