const productsService = require('../services/productsService');

const add = async (req, res) => {
  const { name, quantity } = req.body;

  const { status, data, message } = await productsService.add(name, quantity);

  if (message) {
    return res.status(status)
      .json({ err: { code: 'invalid_data', message } });
  }

  res.status(status).json(data);
};

const getAll = async (_req, res) => {
  const { status, data } = await productsService.getAll();
  
  res.status(status).json({ products: data });
};

const getById = async (req, res) => {
  const { id } = req.params;

  const { status, data, message } = await productsService.getById(id);
  
  if (message) {
    return res.status(status)
      .json({ err: { code: 'invalid_data', message } });
  }
  
  res.status(status).json(data);
};

const update = async (req, res) => {
  const { id } = req.params;

  const { status, data } = await productsService.update(id, req.body);
  
  res.status(status).json(data);
};

const remove = async (req, res) => {
  const { id } = req.params;

  const { status, data, message } = await productsService.remove(id);
  
  if (message) {
    return res.status(status)
      .json({ err: { code: 'invalid_data', message } });
  }
  
  res.status(status).json(data);
};

module.exports = {
  add,
  getAll,
  getById,
  update,
  remove,
};
