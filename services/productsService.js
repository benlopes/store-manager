const product = require('../models/productsModel');

const add = async (productData) => {
  const foundProduct = await product.findByName(productData.name);

  const message = 'Product already exists';

  if (foundProduct) {
    return { status: 422, message };
  }
  
  const addedProduct = await product.add(productData);

  return { status: 201, data: addedProduct };
};

const getAll = async () => {
  const products = await product.getAll();

  return { status: 200, data: products };
};

const getById = async (id) => {
  const returnedProduct = await product.getById(id);

  const message = 'Wrong id format';

  if (!returnedProduct) {
    return { status: 422, message };
  }

  return { status: 200, data: returnedProduct };
};

const update = async (id) => {
  const returnedProduct = await product.update(id);

  return { status: 200, data: returnedProduct };
};

module.exports = {
  add,
  getAll,
  getById,
  update,
};
