import { app, chai, expect, sinon } from '../test.config';
import { createProductRequest, generateManyProductResponses, productResponse } from './product.mock';

import { ObjectId } from 'mongodb';
import { ProductService } from '../../services/productService';
import { StatusCodes } from 'http-status-codes';

const productService = ProductService.getInstance();

describe('Product Controller', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const addProductStub = sinon.stub(productService, 'create').resolves(productResponse);

      const response = await chai.request(app).post('/products').send(createProductRequest);

      expect(response.status).to.equal(StatusCodes.CREATED);
      expect(response.body).to.deep.equal(productResponse);
      expect(addProductStub.calledOnceWith(createProductRequest)).to.be.true;
    });

    describe('product validation', () => {
      const testCases = [
        {
          description: 'name is not a string',
          requestBody: {
            ...createProductRequest,
            name: 5,
          },
        },
        {
          description: 'name is missing',
          requestBody: {
            ...createProductRequest,
            name: undefined,
          },
        },
        {
          description: 'name is null',
          requestBody: {
            ...createProductRequest,
            name: null,
          },
        },
        {
          description: 'name is longer than 50 characters',
          requestBody: {
            ...createProductRequest,
            name: 'a'.repeat(51),
          },
        },
        {
          description: 'description is not a string',
          requestBody: {
            ...createProductRequest,
            description: 5,
          },
        },
        {
          description: 'description is missing',
          requestBody: {
            ...createProductRequest,
            description: undefined,
          },
        },
        {
          description: 'description is null',
          requestBody: {
            ...createProductRequest,
            description: null,
          },
        },
        {
          description: 'description is longer than 50 characters',
          requestBody: {
            ...createProductRequest,
            description: 'a'.repeat(51),
          },
        },
        {
          description: 'price is not a float',
          requestBody: {
            ...createProductRequest,
            price: 'not a float',
          },
        },
        {
          description: 'price is missing',
          requestBody: {
            ...createProductRequest,
            price: undefined,
          },
        },
        {
          description: 'price is null',
          requestBody: {
            ...createProductRequest,
            price: null,
          },
        },
        {
          description: 'price is negative',
          requestBody: {
            ...createProductRequest,
            price: -1,
          },
        },
        {
          description: 'stock is not an integer',
          requestBody: {
            ...createProductRequest,
            stock: 'not an int',
          },
        },
        {
          description: 'stock is missing',
          requestBody: {
            ...createProductRequest,
            stock: undefined,
          },
        },
        {
          description: 'stock is null',
          requestBody: {
            ...createProductRequest,
            stock: null,
          },
        },
        {
          description: 'stock is negative',
          requestBody: {
            ...createProductRequest,
            stock: -1,
          },
        },
      ];

      testCases.forEach(testCase => {
        it(`should respond with 400 - ${testCase.description}`, async () => {
          const response = await chai
            .request(app)
            .post('/products')
            .send({
              ...testCase.requestBody,
            });

          expect(response).to.have.status(StatusCodes.BAD_REQUEST);
        });
      });
    });
  });

  describe('GET /products', () => {
    it('should get all products', async () => {
      const productListResponse = generateManyProductResponses(10);
      const getAllProductsStub = sinon.stub(productService, 'get').resolves(productListResponse);

      const response = await chai.request(app).get('/products');

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.deep.equal(productListResponse);
      expect(getAllProductsStub.calledOnce).to.be.true;
    });

    it('should respond with 500 if there is an error', async () => {
      sinon.stub(productService, 'get').throws(new Error('Internal Server Error'));

      const response = await chai.request(app).get('/products');

      expect(response.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).to.deep.equal({ message: 'Internal Server Error' });
    });
  });

  describe('POST /products/:id/restock', () => {
    it('should restock a product', async () => {
      const updateStockStub = sinon.stub(productService, 'restock').resolves(productResponse);
      sinon.stub(productService, 'getProductById').resolves(productResponse);

      const response = await chai.request(app).post(`/products/${productResponse.id}/restock`).send();

      expect(response.status).to.equal(StatusCodes.OK);
      expect(updateStockStub.calledOnceWith(productResponse.id)).to.be.true;
    });

    it('should respond with 400 if it is not validate mongo id', async () => {
      const nonExistentProductId = 'nonexistent';
      const response = await chai.request(app).post(`/products/${nonExistentProductId}/restock`).send();

      expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 404 if product is not found', async () => {
      sinon.stub(productService, 'getProductById').resolves(null);

      const nonExistentProductId = new ObjectId().toString();
      const response = await chai.request(app).post(`/products/${nonExistentProductId}/restock`).send();

      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.body).to.deep.equal({ message: 'The product with the given id does not exist.' });
    });
  });

  describe('POST /products/:id/sell', () => {
    it('should sell a product', async () => {
      const updateStockStub = sinon.stub(productService, 'sell').resolves(productResponse);
      sinon.stub(productService, 'getProductById').resolves(productResponse);

      const response = await chai.request(app).post(`/products/${productResponse.id}/sell`).send();

      expect(response.status).to.equal(StatusCodes.OK);
      expect(updateStockStub.calledOnceWith(productResponse.id)).to.be.true;
    });

    it('should respond with 400 if it is not validate mongo id', async () => {
      const nonExistentProductId = 'nonexistent';
      const response = await chai.request(app).post(`/products/${nonExistentProductId}/sell`).send();

      expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
    });

    it('should respond with 403 if stock cannot go below zero', async () => {
      const updatedProduct = { ...productResponse, stock: 0 };
      sinon.stub(productService, 'sell').resolves(updatedProduct);
      sinon.stub(productService, 'getProductById').resolves(updatedProduct);

      const response = await chai.request(app).post(`/products/${productResponse.id}/sell`).send();

      expect(response.status).to.equal(StatusCodes.FORBIDDEN);
      expect(response.body).to.deep.equal({ message: 'The product stock cannot decrease below zero' });
    });

    it('should respond with 404 if product is not found', async () => {
      sinon.stub(productService, 'getProductById').resolves(null);

      const nonExistentProductId = new ObjectId().toString();
      const response = await chai.request(app).post(`/products/${nonExistentProductId}/sell`).send();

      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
      expect(response.body).to.deep.equal({ message: 'The product with the given id does not exist.' });
    });
  });
});
