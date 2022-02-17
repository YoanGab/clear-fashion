/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adressebrand = require('./sources/adressebrand');

async function sandbox (eshop = 'dedicated') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    let brand = '';
    let url = '';
    switch(eshop) {
      case 'dedicated':
        brand = dedicatedbrand;
        url = 'https://www.dedicatedbrand.com/en/men/news';
        break;
      case 'montlimart':
        brand = montlimartbrand;
        url = 'https://www.montlimart.com/toute-la-collection.html';
        break;
      case 'adresse':
        brand = adressebrand;
        url = 'https://adresse.paris/630-toute-la-collection';
        break;
      default:
        console.log(`🚫  ${eshop} is not supported`);
        process.exit(1);
    }
    const products = await brand.scrape(url);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop.toLowerCase());
