const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});


app.get('/products/search', (request, response) => {
  const limit = parseInt(request.query.limit) || 12;
  const brand = request.query.brand || 'All brands';
  const price = parseInt(request.query.price) || -1;
  db.getProducts(limit, brand, price)
    .then(products => {
      response.send(products);
    })
    .catch(error => {
      response.status(500).send(error);
    });
});

app.get('/products/:id', (request, response) => {
  const id = request.params.id;
  db.getProductById(id)
    .then(product => {
      response.send(product);
    })
    .catch(error => {
      response.status(500).send(error);
    });
});


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
