import { Document, Schema, model } from 'mongoose';

import { CreateProductRequestDto } from '../dto/product';

export interface ProductDocument extends CreateProductRequestDto, Document {}

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be below 0'],
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be below 0'],
  },
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: unknown, product: ProductDocument) {
    delete product._id;
  },
});

export const Product = model<ProductDocument>('Product', productSchema);
