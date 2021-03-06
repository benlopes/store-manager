const express = require('express');
const bodyParser = require('body-parser').json();
const products = require('./controllers/productsController');
const sales = require('./controllers/salesController');

const app = express();
app.use(bodyParser);

const PORT = '3000';

const middleware = require('./middlewares');

app.get('/', (_request, response) => {
  response.send();
});

// products routes
app.post('/products',
  middleware.valName,
  middleware.valProductQty,
  products.add);

app.get('/products', products.getAll);
app.get('/products/:id', products.getById);

app.put('/products/:id',
  middleware.valName,
  middleware.valProductQty,
  products.update);

app.delete('/products/:id', products.remove);

// sales routes
app.post('/sales', middleware.valSaleQty, sales.add);

app.get('/sales', sales.getAll);
app.get('/sales/:id', sales.getById);

app.put('/sales/:id', middleware.valSaleQty, sales.update);

app.delete('/sales/:id', sales.remove);

app.use(middleware.error);

app.listen(PORT, () => {
  console.log('Online');
});
