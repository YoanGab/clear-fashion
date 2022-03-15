const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const service = require('./service')

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
    service.searchProducts(request.query)
        .then((products) => {
            response.send(products);
        })
        .catch((error) => {
            response.status(500).send(error);
        });
});

app.get('/products/:id', (request, response) => {
    service.getProductById(request.params.id)
        .then((product) => {
            response.send(product);
        })
        .catch((error) => {
            response.status(500).send(error);
        });
});


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
