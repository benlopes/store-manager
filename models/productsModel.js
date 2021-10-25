const { ObjectID } = require('mongodb');
const mongoConnection = require('../infra/connection');

const add = async ({ name, quantity }) => {
  const productsCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('products'));

  const addedProduct = await productsCollection
    .insertOne({ name, quantity });

  return { _id: addedProduct.id, name, quantity };
};
