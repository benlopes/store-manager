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

module.exports = {
  add,
};