const { ObjectID } = require('mongodb');
const mongoConnection = require('../infra/connection');

const add = async ({ name, quantity }) => {
  const productsCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('products'));

  const addedProduct = await productsCollection
    .insertOne({ name, quantity });

    return { _id: addedProduct.insertedId, name, quantity };
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

const update = async (id, newInfo) => {
  const { name, quantity } = newInfo;

  if (!ObjectID.isValid(id)) return null;

  const db = await mongoConnection.getConnection();

  await db.collection('products')
    .updateOne({ _id: ObjectID(id) }, { $set: { name, quantity } });

  const product = await getById(id);

  return product;
};

const remove = async (id) => {
  const db = await mongoConnection.getConnection();

  if (!ObjectID.isValid(id)) return null;
  
  const product = await getById(id);
  
  await db.collection('products').deleteOne({ _id: ObjectID(id) });
  
  return product;
};

// helped here by the gentleman @Adelinojnr
const findByName = async (name) => {
  const db = await mongoConnection.getConnection();

  const foundProduct = db.collection('products').findOne({ name });
  
  return foundProduct;
};

module.exports = { 
  add,
  getAll,
  getById,
  update,
  remove,
  findByName,
};
