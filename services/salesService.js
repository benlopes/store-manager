const sale = require('../models/salesModel');
const product = require('../models/productsModel');

const add = async (saleData) => {
  const foundSale = await sale.getByItensSold(saleData.name);

  const message = 'erro';

  if (foundSale) return { status: 422, message };

  const { productId, quantity } = saleData;

  const foundProduct = await product.getById(productId);
  const quantityResult = foundProduct.quantity - quantity;
  
  const err = 'Such amount is not permitted to sell';

  if (quantityResult < 0) return { status: 404, err };
  
  const data = { name: foundProduct.name, quantity: quantityResult };
  
  await product.update(productId, data.name, data.quantity);

  const addedSale = await sale.add(saleData);

  return { status: 201, data: addedSale };
};

const getAll = async () => {
  const sales = await sale.getAll();

  return { status: 200, data: sales };
};

const getById = async (id) => {
  const returnedSale = await sale.getById(id);

  const message = 'Sale not found';

  if (!returnedSale) {
    return { status: 404, message };
  }

  return { status: 200, data: returnedSale };
};

const update = async (id, itensSold) => {
  const sales = await sale.update(id, itensSold);

  return { status: 200, data: sales };
};

module.exports = {
  add,
  getAll,
  getById,
  update,
};
