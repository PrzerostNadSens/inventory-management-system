import { Order } from '../models/order';

export class OrderDao {
  async createOrder(
    customerId: string,
    products: Array<{ productId: string; quantity: number }>,
  ): Promise<{ id: string }> {
    const productToSave = await Order.create({ customerId, products });

    return { id: productToSave._id };
  }
}
