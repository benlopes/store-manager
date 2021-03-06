const UNPROCESSABLE_ENTITY_STATUS = 422;

const MIN_NAME_LENGTH = 5;
const MIN_QTY = 0;

const valName = (req, res, next) => {
  const { name } = req.body;

  if (typeof name !== 'string') {
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({
      err: {
        code: 'invalid_data',
        message: '"name" must be a string',
      },
    });
  }

  if (name.length <= MIN_NAME_LENGTH) {
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({
      err: {
        code: 'invalid_data',
        message: '"name" length must be at least 5 characters long',
      },
    });
  }

  next();
};

const valProductQty = (req, res, next) => {
  const { quantity } = req.body;

  if (typeof quantity !== 'number') {
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({
      err: {
        code: 'invalid_data',
        message: '"quantity" must be a number',
      },
    });
  }

  if (quantity <= MIN_QTY) {
    return res.status(UNPROCESSABLE_ENTITY_STATUS).json({
      err: {
        code: 'invalid_data',
        message: '"quantity" must be larger than or equal to 1',
      },
    });
  }

  next();
};

const valSaleQty = (req, res, next) => {
  let error = null;

  const message = 'Wrong product ID or invalid quantity';

  req.body.forEach((sale) => {
    if (typeof sale.quantity !== 'number') {
      error = { err: { code: 'invalid_data', message } };
    }

    if (sale.quantity <= MIN_QTY) {
      error = { err: { code: 'invalid_data', message } };
    }
  });

  if (error !== null) return res.status(UNPROCESSABLE_ENTITY_STATUS).json(error);

  next();
};

module.exports = {
  valName,
  valProductQty,
  valSaleQty,
};
