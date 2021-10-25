sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../services/productsService');
const productsController = require('../../controllers/productsController');

// const salesService = require('../../services/salesService');
// const salesController = require('../../controllers/salesController');

describe('CRUD functions on products controller', () => {
  const mockProduct = { _id: '204cb554311d68f491ba5788', name: 'Product 3', quantity: 2 };
  const mockProductService = { status: 200, data: mockProduct };

  describe('when there are no products', () => {
    const request = {};
    const response = {};

    before(() => {
      request.body = {
        name: 'Product 3',
        quantity: 2,
      };

      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();

      sinon.stub(productsService, 'add').resolves({ status: 201, data: mockProductService.data });
    });

    after(() => {
      productsService.add.restore();
    });
    
    it('the add products controller runs with the status code 201', async () => {
      await productsController.add(request, response);

      expect(response.status.calledWith(201)).to.be.equal(true);
    });

    it('function is called with json containing the requested data', async () => {
      await productsController.add(request, response);
      expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });

  });

  describe('when there are products added', async () => {
    const request = {};
    const response = {};

    after(() => {
      productsService.getAll.restore();
      productsService.getById.restore();

    });
    describe('list all products', async () => {
      before(() => {
        request.body = {};
  
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsService, 'getAll').resolves(mockProductService);
      });

      it('function is called with json containing the requested data', async () => {
        await productsController.getAll(request, response);
        expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });
    })
    
    describe('list by id', async () => {
      before(() => {
        request.body = {};
  
        request.params = { id: '204cb554311d68f491ba5788' };
  
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsService, 'getById').resolves(mockProductService);
      });
      it('function is called with json containing the requested data 2', async () => {
        await productsController.getById(request, response);
        expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });
    })
  });

  describe('when a product is updated or deleted', async () => {
    describe('update controller', () => {
      const request = {};
      const response = {};
  
      before(() => {
        request.body = {};
  
        request.params = { id: '204cb554311d68f491ba5788' };
  
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsService, 'update').resolves(mockProductService);
      });

      after(() => {
        productsService.update.restore();
      });
      
      it('the controller runs with the status code 200', async () => {
        await productsController.update(request, response);
  
        expect(response.status.calledWith(200)).to.be.equal(true);
      });
  
      it('function is called with json containing the requested data 2', async () => {
        await productsController.update(request, response);
        expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });
    })
    
    describe('remove controller', () => {
      const request = {};
      const response = {};
  
      before(() => {
        request.body = {};
  
        request.params = { id: '204cb554311d68f491ba5788' };
  
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsService, 'remove').resolves(mockProductService);
      });

      after(() => {
        productsService.remove.restore();
      });

      it('the remove products controller runs with the status code 200', async () => {
        await productsController.remove(request, response);
  
        expect(response.status.calledWith(200)).to.be.equal(true);
      });
  
      it('remove products controller is called with json containing object', async () => {
        await productsController.remove(request, response);
        expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });
    });
  });
});