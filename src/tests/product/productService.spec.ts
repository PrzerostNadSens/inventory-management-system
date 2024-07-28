import { expect, sinon } from '../test.config';
import { generateManyProductResponses, generateProductResponse } from './product.mock';

import HttpException from '../../exceptions/httpException';
import { ProductDao } from '../../dao/product.dao';
import { ProductService } from '../../services/productService';
import { StatusCodes } from 'http-status-codes';

const productService = ProductService.getInstance();

describe('Product Service', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('addProduct', () => {
    it('should add a new product', async () => {
      const productData = generateProductResponse();
      const product = { ...productData, id: undefined };

      const createProductStub = sinon.stub(ProductDao.prototype, 'createProduct').resolves(product);

      const result = await productService.create(productData);
      expect(createProductStub.calledOnceWith(productData)).to.be.true;
      expect(result).to.deep.equal(product);
    });
  });

  describe('getAllProducts', () => {
    it('should get all products', async () => {
      const productListResponse = generateManyProductResponses(10);
      const getAllProductsStub = sinon.stub(ProductDao.prototype, 'getAllProducts').resolves(productListResponse);

      const result = await productService.get();
      expect(getAllProductsStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(productListResponse);
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
  describe('getProductById', () => {
    it('should get a product by id', async () => {
      const product = generateProductResponse();
      const getProductByIdStub = sinon.stub(ProductDao.prototype, 'getProductById').resolves(product);

      const result = await productService.getProductById(product.id);
      expect(getProductByIdStub.calledOnceWith(product.id)).to.be.true;
      expect(result).to.deep.equal(product);
    });

    it('should throw a 404 error if product is not found', async () => {
      sinon.stub(ProductDao.prototype, 'getProductById').resolves(null);

      try {
        await productService.getProductById('nonExistentId');
      } catch (error) {
        expect(error).to.be.instanceOf(HttpException);
        expect(error.status).to.equal(StatusCodes.NOT_FOUND);
        expect(error.message).to.equal('Product with this id does not exist');
      }
    });
  });

  describe('restock', () => {
    it('should restock a product', async () => {
      const product = generateProductResponse();
      sinon.stub(ProductDao.prototype, 'getProductById').resolves(product);
      const restockStub = sinon.stub(ProductDao.prototype, 'updateStock').resolves(product);

      const result = await productService.restock(product.id);
      expect(restockStub.calledOnceWith(product.id, 1)).to.be.true;
      expect(result).to.deep.equal(product);
    });

    it('should throw a 404 error if product is not found during restock', async () => {
      sinon.stub(ProductDao.prototype, 'getProductById').resolves(null);

      try {
        await productService.restock('nonExistentId');
      } catch (error) {
        expect(error).to.be.instanceOf(HttpException);
        expect(error.status).to.equal(StatusCodes.NOT_FOUND);
        expect(error.message).to.equal('Product with this id does not exist');
      }
    });
  });

  describe('sell', () => {
    it('should sell a product', async () => {
      const product = generateProductResponse();
      sinon.stub(ProductDao.prototype, 'getProductById').resolves(product);
      const updateStockStub = sinon.stub(ProductDao.prototype, 'updateStock').resolves(product);

      const result = await productService.sell(product.id);
      expect(updateStockStub.calledOnceWith(product.id, -1)).to.be.true;
      expect(result).to.deep.equal(product);
    });

    it('should throw a 403 error if stock is zero or less', async () => {
      const product = generateProductResponse('fakeId', 0);
      sinon.stub(ProductDao.prototype, 'getProductById').resolves(product);

      try {
        await productService.sell('fakeId');
      } catch (error) {
        expect(error).to.be.instanceOf(HttpException);
        expect(error.status).to.equal(StatusCodes.FORBIDDEN);
        expect(error.message).to.equal('The product stock cannot decrease below zero');
      }
    });

    it('should throw a 404 error if product is not found during sell', async () => {
      sinon.stub(ProductDao.prototype, 'getProductById').resolves(null);

      try {
        await productService.sell('nonExistentId');
      } catch (error) {
        expect(error).to.be.instanceOf(HttpException);
        expect(error.status).to.equal(StatusCodes.NOT_FOUND);
        expect(error.message).to.equal('Product with this id does not exist');
      }
    });
  });
});
