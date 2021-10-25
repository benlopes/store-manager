const express = require('express');
const bodyParser = require('body-parser').json();

const app = express();
app.use(bodyParser);

const PORT = '3000';

const middleware = require('./middlewares');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use(middleware.error);

app.listen(PORT, () => {
  console.log('Online');
});
