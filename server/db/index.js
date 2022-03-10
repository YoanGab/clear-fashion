require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = process.env.MONGODB_URI;

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
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
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
    const result = await collection.find(query).toArray();

    return result;
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

