const { ObjectID } = require('mongodb');
const mongoConnection = require('../infra/connection');

const add = async (salesItems) => {
  const sales = await mongoConnection.getConnection()
    .then((db) => db.collection('sales'));

  const itensSold = salesItems;

  const insert = await sales.insertOne({ itensSold });

  return { _id: insert.insertedId, itensSold };
};

const getAll = async () => {
  const db = await mongoConnection.getConnection();
  
  const sales = await db.collection('sales').find().toArray();

  const salesList = { sales: [...sales] };

  return salesList;
};

const getById = async (id) => {
  if (!ObjectID.isValid(id)) return null;

  const db = await mongoConnection.getConnection();

  const sale = await db.collection('sales')
    .findOne(new ObjectID(id));

  return sale;
};

module.exports = { 
  add,
  getAll,
  getById,
};
