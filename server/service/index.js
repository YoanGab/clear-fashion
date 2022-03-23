const db = require("../db");

module.exports.searchProducts = async (query) => {
    const limit = parseInt(query.limit) || 12;
    const brand = query.brand || 'All brands';
    const price = parseInt(query.price) || -1;
    const page = parseInt(query.page) || 1;
    const sort = query.sort || 'price-asc';
    return db.getProducts(limit, brand, price, page, sort);
};


module.exports.getProductById = async (id) => {
    return db.getProductById(id);
};

module.exports.getBrands = async () => {
    return db.getBrands();
};
