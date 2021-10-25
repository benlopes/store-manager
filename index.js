const express = require('express');
const bodyParser = require('body-parser').json();

const app = express();
app.use(bodyParser);

const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(PORT, () => {
  console.log('Online');
});
