const db = require("../db");

module.exports.searchProducts = async (query) => {
    const limit = parseInt(query.limit) || 12;
    const brand = query.brand || 'All brands';
    const price = parseInt(query.price) || -1;
    return db.getProducts(limit, brand, price)
};


module.exports.getProductById = async (id) => {
    return db.getProductById(id);
};
