import { app, chai, expect, sinon } from '../test.config';

import { ObjectId } from 'mongodb';
import { OrderService } from '../../services/orderService';
import { StatusCodes } from 'http-status-codes';
import { createOrderRequest } from './order.mock';

const orderService = OrderService.getInstance();

describe('Order Controller', () => {
  beforeEach(() => {
    sinon.restore();
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const orderId = new ObjectId().toString();

      const createStub = sinon.stub(orderService, 'create').resolves({ id: orderId });

      const response = await chai.request(app).post('/orders').send(createOrderRequest);

      expect(response.status).to.equal(StatusCodes.ACCEPTED);
      expect(response.body).to.deep.equal({ id: orderId });

      expect(createStub.calledOnceWith(createOrderRequest)).to.be.true;
    });

    describe('Order validation', () => {
      const testCases = [
        {
          description: 'customerId is not a string',
          requestBody: { ...createOrderRequest, customerId: 5 },
        },
        {
          description: 'customerId is missing',
          requestBody: { ...createOrderRequest, customerId: undefined },
        },
        {
          description: 'customerId is null',
          requestBody: { ...createOrderRequest, customerId: null },
        },
        {
          description: 'products array contains invalid product id',
          requestBody: { ...createOrderRequest, products: [{ id: 'invalidId', quantity: 1 }] },
        },
        {
          description: 'products array contains invalid quantity',
          requestBody: {
            ...createOrderRequest,
            products: [{ id: createOrderRequest.products[0].id, quantity: 'invalid' }],
          },
        },
        {
          description: 'quantity is less than 1',
          requestBody: { ...createOrderRequest, products: [{ id: createOrderRequest.products[0].id, quantity: 0 }] },
        },
      ];

      testCases.forEach(testCase => {
        it(`should respond with 400 - ${testCase.description}`, async () => {
          const response = await chai.request(app).post('/orders').send(testCase.requestBody);

          expect(response).to.have.status(StatusCodes.BAD_REQUEST);
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should respond with 500 if there is an error', async () => {
      sinon.stub(orderService, 'create').throws(new Error('Internal Server Error'));

      const response = await chai.request(app).post('/orders').send(createOrderRequest);

      expect(response.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).to.deep.equal({ message: 'Internal Server Error' });
    });
  });
});
