const { ObjectID } = require('mongodb');
const mongoConnection = require('../infra/connection');

const add = async ({ name, quantity }) => {
  const productsCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('products'));

  const addedProduct = await productsCollection
    .insertOne({ name, quantity });

  return { _id: addedProduct.id, name, quantity };
};

const getAll = async () => {
  const db = await mongoConnection.getConnection();

  const products = await db.collection('products').find().toArray();

  return products;
};

const getById = async (id) => {
  if (!ObjectID.isValid(id)) return null;

  const db = await mongoConnection.getConnection();

  const product = await db.collection('products')
    .findOne({ _id: ObjectID(id) });

  return product;
};

const update = async (id, name, qty) => {
  if (!ObjectID.isValid(id)) return null;

  const db = await mongoConnection.getConnection();

  await db.collection('products')
    .updateOne({ _id: ObjectID(id) }, { $set: { name, quantity: qty } });

  const product = await getById(id);

  return product;
};

module.exports = { 
  add,
  getAll,
  getById,
  update,
};
