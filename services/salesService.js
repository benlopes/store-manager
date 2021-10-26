const sale = require('../models/salesModel');
const product = require('../models/productsModel');

const add = async (saleData) => {
  const foundSale = await sale.getByItensSold(saleData);
  const message = 'erro';
  const err = 'Such amount is not permitted to sell';
  
  if (foundSale) return { status: 422, message };

  saleData.forEach(async (el) => {
    const checkProduct = await product.getById(el.productId);

    if ((checkProduct.quantity - el.quantity) < 0) return { status: 404, err };
    const data = { name: checkProduct.name, quantity: checkProduct.quantity - el.quantity };
    
    await product.update(el.productId, data.name, data.quantity);
  });

  const addedSale = await sale.add(saleData);

  return { status: 200, data: addedSale };
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

const remove = async (id) => {
  const products = await sale.getById(id);

  const message = 'Wrong sale ID format';

  if (!products) return { status: 422, message };

  const { productId, quantity } = products.itensSold[0];

  const foundProduct = await product.getById(productId);
  const quantityResult = foundProduct.quantity + quantity;

  const data = { name: foundProduct.name, quantity: quantityResult };
  await product.update(productId, { name: data.name, quantity: data.quantity }); 

  const removedSale = await sale.remove(id);
  return { status: 200, data: removedSale };
};

module.exports = {
  add,
  getAll,
  getById,
  update,
  remove,
};
