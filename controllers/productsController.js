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

module.exports = {
  add,
};
