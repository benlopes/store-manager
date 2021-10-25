const { ObjectID } = require('mongodb');
const mongoConnection = require('../infra/connection');

const add = async (salesItems) => {
  const sales = await mongoConnection.getConnection()
    .then((db) => db.collection('sales'));

  const itensSold = salesItems;

  const insert = await sales.insertOne({ itensSold });

  return { _id: insert.insertedId, itensSold };
};

module.exports = { 
  add,
};
