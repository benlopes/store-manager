sinon = require('sinon');
const { expect } = require('chai');

const productsModel = require('../../models/productsModel');
const productsService = require('../../services/productsService');
const salesModel = require('../../models/salesModel');
const salesService = require('../../services/salesService');

describe('CRUD functions behavior on products services', () => {

  describe('when there are no products', async () => {
    before(() => {
      sinon.stub(productsModel, 'getAll')
        .resolves([]);
    });

    after(() => {
      productsModel.getAll.restore();
    });


    it('returns an array', async () => {
      const response = await productsModel.getAll();
      expect(response).to.be.an('array');
    })

    it('the array is empty', async () => {
      const response = await productsModel.getAll();
      expect(response).to.be.empty;
    });
  });

  describe('when there are products added', async () => {
    before(async () => {
      sinon.stub(productsModel, 'getAll')
        .resolves([
          {
            products: [
              {
                _id: '604cb554311d68f491ba5781',
                name: 'Product 1',
                quantity: 1,
              },
              {
                _id: '161cb464811d68f491bb5872',
                name: 'Product 2',
                quantity: 3,
              }
            ]
          }
        ]);

      sinon.stub(productsModel, 'getById')
        .resolves(
          {
            _id: '604cb554311d68f491ba5781',
            name: 'Product 1',
            quantity: 1,
          }
        );
    });

    after(async () => {
      productsModel.getAll.restore();
      productsModel.getById.restore();
    });

    it('should return an object', async () => {
      const response = await productsService.getAll();
      expect(response).to.be.an('object');
    });

    it('should return an object with properties status and data', async () => {
      const response = await productsService.getAll();
      expect(response).to.be.include.all.keys('status', 'data');
    });

    // tests the getAll function
    it('should return an object with status and data on products list', async () => {
      const modelResponse = await productsModel.getAll();
      const mockProductService = { status: 200, data: modelResponse };
      
      const response = await productsService.getAll();
      expect(response).to.deep.equal(mockProductService);
    });

    it('should return product found by id', async () => {
      const modelResponse = await productsModel.getAll();
      const product1Id = modelResponse[0].products[0]._id;
      const mockProductService = { status: 200, data: modelResponse[0].products[0] };
      
      const response = await productsService.getById(product1Id);
      expect(response).to.deep.equal(mockProductService);
    });
  });

  describe('when a new product is succesfully added', async () => {
    const mockProduct = { _id: '204cb554311d68f491ba5788', name: 'Product 3', quantity: 2 };
    before(async () => {
      sinon.stub(productsModel, 'add')
        .resolves(mockProduct);
    });

    after(async () => {
      productsModel.add.restore();
    });

    it('should return the added product', async () => {
      const mockAddService = { status: 201, data: mockProduct };
      const productName = 'Product 3';
      const productQty = 2;
      const paramMock = { name: productName, quantity: productQty };

      const response = await productsService.add(paramMock);
      expect(response).to.deep.equal(mockAddService);
    });


  });

  describe('when a product is updated or deleted', async () => {
    //1. create mocks for the productModel f()s and productsService f()s returns
    // 1.1 productModels f()s mocks:
      const modelMock = { _id: '5f43a7ca92d58904914656b6', name: `Batista's Product`, quantity: 5 };
    // 1.2 productsService f()s mocks:
      const serviceMock = { status: 200, data: modelMock };

    //2. stub the return of product.remove(id) and product.update(id)
    before(async () => {
      sinon.stub(productsModel, 'getById').resolves(modelMock);
      sinon.stub(productsModel, 'update')
        .resolves(modelMock);
      sinon.stub(productsModel, 'remove')
      .resolves(modelMock);  
    });

    after(async () => {
      productsModel.update.restore();
      productsModel.getById.restore();
      productsModel.remove.restore();
    });

    it('update product service should return the status and updated data', async () => {
      const response = await productsService.update(modelMock._id);
      expect(response).to.deep.equal(serviceMock);
    });

    it('remove product service should return the status and deleted data', async () => {
      const response = await productsService.remove(modelMock._id);
      expect(response).to.deep.equal(serviceMock);
    });
  });
})

describe('CRUD functions behavior on sales services', () => {

  const mockSale = { 
    _id: '5f43cbf4c45ff5104986e81d',
    itensSold: [{ productId: '6f43fbf5c51dd5104986e18e', 'quantity': 2 }],
  };

  const mockSales = { 
    _id: '5f43cbf4c45ff5104986e81d',
    itensSold: [
      { productId: '6f43fbf5c51dd5104986e18e', 'quantity': 2 },
      { productId: '82f1fbf6c71cd5014696e26a', 'quantity': 1 }
    ],
  };

  describe('when there are no sales', async () => {
    before(() => {
      sinon.stub(salesModel, 'getAll')
        .resolves([]);
    });

    after(() => {
      salesModel.getAll.restore();
    });


    it('returns an array', async () => {
      const response = await salesModel.getAll();
      expect(response).to.be.an('array');
    })

    it('the array is empty', async () => {
      const response = await salesModel.getAll();
      expect(response).to.be.empty;
    });
  });

  describe('when there are sales added', async () => {
    before(async () => {
      sinon.stub(salesModel, 'getAll')
        .resolves(mockSales);

      sinon.stub(salesModel, 'getById')
        .resolves(mockSales);
    });

    after(async () => {
      salesModel.getAll.restore();
      // productsModel.getById.restore();
    });

    it('should return an object', async () => {
      const response = await salesService.getAll();
      expect(response).to.be.an('object');
    });

    it('should return an object with properties status and data', async () => {
      const response = await salesService.getAll();
      expect(response).to.be.include.all.keys('status', 'data');
    });

    // tests the getAll function
    it('should return an object with status and data on products list', async () => {
      const modelResponse = await salesModel.getAll();
      const mockSaleService = { status: 200, data: modelResponse };

      const response = await salesService.getAll();
      expect(response).to.deep.equal(mockSaleService);
    });

    it('should return product found by id', async () => {
      const modelResponse = await salesModel.getAll();
      const saleId = modelResponse._id;
      const mockSaleService = { status: 200, data: modelResponse };
      
      const response = await salesService.getById(saleId);
      expect(response).to.deep.equal(mockSaleService);
    });
  });

  describe('when a new sale is succesfully added', async () => {

    before(async () => {
      sinon.stub(salesModel, 'add')
        .resolves(mockSales);
      sinon.stub(salesModel, 'getByItensSold')
        .resolves(null)
      sinon.stub(productsModel, 'getById')
        .resolves(mockSale);
    });

    after(async () => {
      salesModel.add.restore();
      salesModel.getByItensSold.restore();
      productsModel.getById.restore();
    });

    it('should return the added product', async () => {
      const mockAddService = { status: 200, data: mockSales };
      const productId = '6f43fbf5c51dd5104986e18e';
      const productQty = 2;
      // const paramMock = [{ productId, quantity: productQty }];
      const paramMock = [
        { productId: '6f43fbf5c51dd5104986e18e', 'quantity': 2 },
        { productId: '82f1fbf6c71cd5014696e26a', 'quantity': 1 }
      ];

      const response = await salesService.add(paramMock);
      expect(response).to.deep.equal(mockAddService);
    });
  });

  describe('when a sale is updated or deleted', async () => {
    const serviceMock = { status: 200, data: mockSale };

    before(async () => {
      sinon.stub(salesModel, 'update').resolves(mockSale);
      sinon.stub(salesModel, 'remove')
        .resolves(mockSale);
      // sinon.stub(salesModel, 'getById')
      //   .resolves({itensSold: [{ _id: '6f43fbf5c51dd5104986e18e', quantity: 1, }]});
      sinon.stub(productsModel, 'getById')
        .resolves({ _id: '6f43fbf5c51dd5104986e18e', name: 'Product 1', quantity: 1, });
    });

    after(async () => {
      salesModel.update.restore();
      salesModel.remove.restore();
      // salesModel.getById.restore();
      productsModel.getById.restore();
    });

    it('update sales service should return the status and updated data', async () => {
      const response = await salesService.update(mockSale._id, mockSale.itensSold);
      expect(response).to.deep.equal(serviceMock);
    });

    it('remove product service should return the status and deleted data', async () => {
      const response = await salesService.remove(mockSale._id);
      expect(response).to.deep.equal(serviceMock);
    });
  });
})