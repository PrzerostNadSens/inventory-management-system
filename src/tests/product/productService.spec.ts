import { expect, sinon } from '../test.config';

import { ProductDao } from '../../dao/product.dao';
import { ProductService } from '../../services/productService';
import { generateManyProductResponses } from './product.mock';

const productService = ProductService.getInstance();

describe('Product Service', () => {
  describe('addProduct', () => {
    it('should add a new product', async () => {
      const productData = { name: 'Test Product', description: 'Test Description', price: 100, stock: 10 };
      const product = { ...productData, _id: 'fakeId' };

      const createProductStub = sinon.stub(ProductDao.prototype, 'createProduct').resolves(product);

      const result = await productService.create(productData);
      expect(createProductStub.calledOnceWith(productData)).to.be.true;
      expect(result).to.deep.equal(product);

      createProductStub.restore();
    });

    it('should throw an error if product data is invalid', async () => {
      const invalidProductData = { name: '', description: '', price: null, stock: null };

      try {
        await productService.create(invalidProductData);
      } catch (error) {
        expect(error.message).to.equal(
          'Product validation failed: name: Path `name` is required., description: Path `description` is required., price: Path `price` is required., stock: Path `stock` is required.',
        );
      }
    });
  });

  describe('getAllProducts', () => {
    it('should get all products', async () => {
      const productListResponse = generateManyProductResponses(10);
      const getAllProductsStub = sinon.stub(ProductDao.prototype, 'getAllProducts').resolves(productListResponse);

      const result = await productService.get();
      expect(getAllProductsStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(productListResponse);

      getAllProductsStub.restore();
    });

    it('should throw an error if there is an issue retrieving products', async () => {
      sinon.stub(ProductDao.prototype, 'getAllProducts').throws(new Error('Database error'));

      try {
        await productService.get();
      } catch (error) {
        expect(error.message).to.equal('Database error');
      }
    });
  });
});
