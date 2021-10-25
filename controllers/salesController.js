const salesService = require('../services/salesService');

const add = async (req, res) => {
  const { status, data, message, err } = await salesService.add(req.body);

  if (message) {
    return res.status(status)
      .json({ err: { code: 'not_found', message } });
  }
  
  if (err) {
    return res.status(status)
      .json({ err: { code: 'stock_problem', message: err } });
  }

  res.status(status).json(data);
};

const getAll = async (_req, res) => {
  const { status, data } = await salesService.getAll();

  res.status(status).json({ sales: data });
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { status, data, message } = await salesService.getById(id);

  if (message) {
    return res.status(status)
      .json({ err: { code: 'not_found', message } });
  }
  
  res.status(status).json(data);
};

const update = async (req, res) => {
  const { id } = req.params;

  const { status, data } = await salesService.update(id, req.body);

  res.status(status).json(data);
};

module.exports = {
  add,
  getAll,
  getById,
  update,
};
