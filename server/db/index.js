require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = 'mongodb+srv://dia3-group9:8qrsHFMm@cluster0.cncvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
    try {
        if (database) {
            console.log('💽  Already Connected');
            return database;
        }

        client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
        database = client.db(MONGODB_DB_NAME);

        console.log('💽  Connected');

        return database;
    } catch (error) {
        console.error('🚨 MongoClient.connect...', error);
        return null;
    }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        // More details
        // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
        products.forEach(product => {
            product.date = new Date();
        });

        return await collection.insertMany(products, {'ordered': false});
    } catch (error) {
        console.error('🚨 collection.insertMany...', error);
        fs.writeFileSync('products.json', JSON.stringify(products));
        return {
            'insertedCount': error.result.nInserted
        };
    }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        return await collection.find(query).toArray();
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
    try {
        await client.close();
    } catch (error) {
        console.error('🚨 MongoClient.close...', error);
    }
};


/**
 * Get all products of a brand
 * @param  {String}  brand
 * @return {Array}
 */
module.exports.getProductsByBrand = async brand => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        return await collection.find({'brand': brand}).toArray();
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};


/**
 * Get all products less than a price
 * @param  {Number}  price
 * @return {Array}
 */
module.exports.getProductsLessThanPrice = async price => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        return await collection.find({'price': {'$lt': price}}).toArray();
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};


/**
 * Find all products sorted by price
 * @return {Array}
 */
module.exports.getProductsSortedByPrice = async () => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        return await collection.find().sort({'price': 1}).toArray();
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};


/**
 * Find all products sorted by date
 * @return {Array}
 */
module.exports.getProductsSortedByDate = async () => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        return await collection.find().sort({'date': -1}).toArray();
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};


/**
 * Find all products scraped less than 2 weeks
 * @return {Array}
 */
module.exports.getProductsScrapedLessThan2Weeks = async () => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        return await collection.find({'date': {'$gt': new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)}}).toArray();
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};


/**
 * Find product by id
 * @param  {String}  id
 * @return {Object}
 */
module.exports.getProductById = async id => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        return await collection.findOne({'_id': id});
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};


/**
 * Get Products
 * @param  {Number}  limit
 * @param  {String}  brand
 * @param  {Number}  price
 * @param  {Number}  page
 * @param  {String}  sort
 * @return {Array}
 */
module.exports.getProducts = async (limit, brand, price, page, sort) => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        let query = {};
        if (brand !== 'All brands') {
            query ['brand'] = brand;
        }
        if (price !== -1) {
            query['price'] = {'$lt': price};
        }
        let offset = (page - 1) * limit;
        let products = await collection.find(query)
        switch(sort) {
            case 'price-asc':
                products = await products.sort({'price': 1}).toArray();
                break;
            case 'price-desc':
                products = await products.sort({'price': -1}).toArray();
                break;
            case 'date-asc':
                products = await products.sort({'date': 1}).toArray();
                break;
            case 'date-desc':
                products = await products.sort({'date': -1}).toArray();
                break;
            default:
                products = await products.sort({'price': -1}).toArray();
                break;
        }

        let nbPages = Math.ceil(products.length / limit);
        return {
            success: true,
            data: {
                result: products.slice(offset, offset + limit),
                meta: {
                    currentPage: page,
                    pageCount: nbPages,
                    pageSize: limit,
                    count: products.length
                }
            }
        };
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};


/**
 * Get all brands
 * @return {Array}
 */
module.exports.getBrands = async () => {
    try {
        const db = await getDB();
        const collection = db.collection(MONGODB_COLLECTION);
        let brands = await collection.distinct('brand');
        return {
            success: true,
            data: brands
        };
    } catch (error) {
        console.error('🚨 collection.find...', error);
        return null;
    }
};

