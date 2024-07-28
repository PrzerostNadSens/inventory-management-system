import { Document, Schema, model } from 'mongoose';

export interface OrderDocument extends Document {
  products: { productId: string; quantity: number }[];
  createdAt: Date;
}

const orderSchema = new Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: unknown, order: OrderDocument) {
    delete order._id;
  },
});

export const Order = model<OrderDocument>('Order', orderSchema);
