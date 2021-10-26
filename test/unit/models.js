const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoConnection = require('../../infra/connection');
const productsModel = require('../../models/productsModel');
const salesModel = require('../../models/salesModel');

const DBServer = new MongoMemoryServer();
let connectionMock;
before(async () => {
  const URLMock = await DBServer.getUri();
  connectionMock = await MongoClient
      .connect(URLMock, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((conn) => conn.db('StoreManager'));

  sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
});

after(async () => {
  mongoConnection.getConnection.restore();
  await DBServer.stop();
});

let productId;

const mockProduct = {
  name: 'Product 1',
  quantity: 1,
};


describe("CRUD functions behavior on products db", () => {
  // teste a função getAllProduct
  // getAllProducts tests
  describe("before adding a product", () => {
    it('returns an array', async () => {
      const response = await productsModel.getAll();
      expect(response).to.be.an('array');
    });

    it('the array is empty', async () => {
        const response = await productsModel.getAll();
        expect(response).to.be.empty;
    });
  });

  const updatedProduct = {
    name: 'Product 2',
    quantity: 3,
  };

  describe("when there are products added", () => {
    before(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').insertOne({ ...mockProduct })
        .then((result) => { productId = result.insertedId });
    });

    after(async () => {
        const db = await mongoConnection.getConnection();
        await db.collection('products').drop();
    });

    it('returns an array', async () => {
      const response = await productsModel.getAll();
      expect(response).to.be.an('array');
    });

    it('the array is not empty', async () => {
        const response = await productsModel.getAll();
        expect(response).not.to.be.empty;
    });

    it('the added product is on the database', async () => {
      const [{ _id, name, quantity }] = await productsModel.getAll();
      expect({ name, quantity }).to.deep.equal(mockProduct);
    });

    it('the added product can be found by id', async () => {
      const foundProduct = await productsModel.getById(productId);
      expect(foundProduct).to.deep.equal({ _id: productId, ...mockProduct });
    });
  });

  // addProduct tests
  describe("when a new product is successfully added", async () => {
    it('returns an object' , async () => {
			const response = await productsModel.add(mockProduct);
			expect(response).to.be.a('object');
		});

    it('the object has the new added product "id"', async () => {
      const response = await productsModel.add(mockProduct);
      expect(response).to.have.a.property('_id');
    });

    it('should exist product with the registered name', async () => {
      await productsModel.add(mockProduct);
      const productAdded = await connectionMock.collection('products').findOne({ name: mockProduct.name });
      expect(productAdded).to.be.not.null;
		});
  })

  // tests the update product function
  describe("when a product is updated or deleted", () => {
    beforeEach(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').insertOne({ ...mockProduct })
        .then((result) => { productId = result.insertedId });
    });

    afterEach(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').drop();
    });

    it('should update the product', async () => {
      const newName = 'Product 2';
      const newQty = 3;
      const prodNameExists = await connectionMock.collection('products')
        .findOne({ name: updatedProduct.name });
      if (!prodNameExists) {
        await productsModel.update(productId, { name: newName, quantity: newQty });
        const productNewInfo = await connectionMock.collection('products')
          .findOne({ name: newName });

        expect(productNewInfo).to.deep.equal({ _id: productId, ...updatedProduct});
      }
    });

    it('should delete the product', async () => {
      const productExists = await productsModel.remove(productId);
      expect(productExists).to.deep.equal({ _id: productId, ...mockProduct});
    });
  })
})

describe("CRUD functions behavior on sales db", () => {
  const product1 = { name: 'Product 1', quantity: 3 };
  const product2 = { name: 'Product 2', quantity: 5 };
  const mockProducts = [product1, product2];
  let product1Id;
  let product2Id;
  before(async () => {
    await connectionMock.collection('products').insertMany(mockProducts);
    const addedProducts = await productsModel.getAll();
    product1Id = addedProducts[0]._id;

    product2Id = addedProducts[1]._id;
  });

  after(async () => {
    const db = await mongoConnection.getConnection();
    await db.collection('products').drop();
  });

  afterEach(async () => {
    await connectionMock.collection('sales').deleteMany();
  });

  // teste a função addSale x
  describe("adding sales", () => {
    it('test if adds on sale successfuly', async () => {
      const mockOneSale = [{ "productId": product1Id, "quantity": 1 }];
      const successReturnOne = { "itensSold": [ ...mockOneSale ] };


      const addOneSaleRes = await salesModel.add(mockOneSale);
      const { _id, ...data } = addOneSaleRes;

      expect(data).to.deep.equal({ ...successReturnOne });
    });

    it('test if adds multiple sales successfuly', async () => {
      const mockManySales = [{ "productId": product1Id, "quantity": 1 },
        { "productId": product2Id, "quantity": 2 }];

      const successReturnMany = { "itensSold": [ ...mockManySales ] };
      const addSalesRes = await salesModel.add(mockManySales);
      const { _id, ...data } = addSalesRes;

      expect(data).to.deep.equal({ ...successReturnMany });
    });
  });

  describe("when there are sales added", () => {
    let registeredSales = {};
    let expectedSales;
    beforeEach(async () => {
      const mockManySales1 = [{ "productId": product1Id, "quantity": 1 },
        { "productId": product2Id, "quantity": 2 }];
      const mockManySales2 = [{ "productId": product2Id, "quantity": 1 }];
      const mockManySales3 = [{ "productId": product1Id, "quantity": 1 }];
      expectedSales = [mockManySales1, mockManySales2, mockManySales3];
 
      const data1 = await salesModel.add(mockManySales1);
      registeredSales.sale1 = data1;
      const data2 = await salesModel.add(mockManySales2);
      registeredSales.sale2 = data2;
      const data3 = await salesModel.add(mockManySales3);
      registeredSales.sale3 = data3;
    });

    afterEach(async () => {
      await connectionMock.collection('sales').deleteMany();
    });

    it('test if it can list the added sales', async () => {
      const { sale1, sale2, sale3 } = registeredSales;

      const expectedSalesList = { sales: [sale1, sale2, sale3] };
      const getAllReturn = await salesModel.getAll();

      expect(getAllReturn).to.deep.equal(expectedSalesList);
    });

    it('test if it can list sale by id', async () => {
      const { sale1 } = registeredSales;
      
      const expectedSale = sale1;
      const expSaleId = sale1._id;
      const getByIdReturn = await salesModel.getById(expSaleId);

      expect(getByIdReturn).to.deep.equal(expectedSale);
    });
  });

  describe("when a sale is updated or deleted", () => {
    let registeredSales = {};
    let expectedSales;
    beforeEach(async () => {
      const mockManySales1 = [{ "productId": product1Id, "quantity": 1 },
        { "productId": product2Id, "quantity": 2 }];
      const mockManySales2 = [{ "productId": product2Id, "quantity": 1 }];
      const mockManySales3 = [{ "productId": product1Id, "quantity": 1 }];
      expectedSales = [mockManySales1, mockManySales2, mockManySales3];
 
      const data1 = await salesModel.add(mockManySales1);
      registeredSales.sale1 = data1;
      const data2 = await salesModel.add(mockManySales2);
      registeredSales.sale2 = data2;
      const data3 = await salesModel.add(mockManySales3);
      registeredSales.sale3 = data3;
    });

    afterEach(async () => {
      await connectionMock.collection('sales').deleteMany();
    });

    it('should update the sale', async () => {
      const { sale2 } = registeredSales;
      const { itensSold } = sale2;

      const newQty = 2;
      const newItensSold = [{ ...itensSold[0], quantity: newQty }];
      const expectedSale = { 
        _id: sale2._id, 
        itensSold: [ { productId: sale2.itensSold[0].productId, quantity: newQty } ]
      };

      const updatedSale = await salesModel.update(sale2._id, newItensSold);

      expect(updatedSale).to.deep.equal(expectedSale);
    });

    it('should delete the sale', async () => {
      const { sale3 } = registeredSales;

      const deletedSale = await salesModel.remove(sale3._id);
      const all = await salesModel.getAll();
      expect(deletedSale).to.deep.equal({ _id: sale3._id, ...sale3 });
    });
  })
});
