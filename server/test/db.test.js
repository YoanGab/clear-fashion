const db = require("../db");


describe("db.getDB()", () => {
  test("should return a database connection", async () => {
    const dbConnection = await db.getDB();
    expect(dbConnection).toBeTruthy();
  });
});

describe("db.find()", () => {
  test("should return a list of all items", async () => {
    const items = await db.find({});
    expect(items.length).toBe(129);
  });
});


describe("db.getProductById()", () => {
  test("should return a product by id", async () => {
    const product = await db.getProductById(
      "678384c9-20bd-5151-9e1a-382984501eb8"
    );
    delete product.date;
    expect(product).toStrictEqual({
      _id: '678384c9-20bd-5151-9e1a-382984501eb8',
      link: 'https://www.dedicatedbrand.com/en/men/basics/t-shirt-stockholm-base-3-pack',
      brand: 'dedicated',
      price: 59,
      name: 'T-shirt Stockholm Base 3-pack',
      photo: 'https://tshirtstore.centracdn.net/client/dynamic/images/5867_7f7925d889-18160-ded-standard.jpg'
    });
  });
});

describe("db.getProductsByBrand()", () => {
  test("should return a list of products by brand", async () => {
    const products = await db.getProductsByBrand("dedicated");
    expect(products.every(product => product.brand === "dedicated")).toBe(true);
  });
});


describe("db.getProductsLessThanPrice()", () => {
  test("should return a list of products by price", async () => {
    const products = await db.getProductsLessThanPrice(60);
    expect(products.every(product => product.price < 60)).toBe(true);
  });
});


describe("db.getProductsSortedByPrice()", () => {
  test("should return a list of products sorted by price", async () => {
    const products = await db.getProductsSortedByPrice();
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].price <= products[i + 1].price).toBe(true);
    }
  });
});

describe("db.getProductsSortedByDate()", () => {
  test("should return a list of products sorted by date", async () => {
    const products = await db.getProductsSortedByDate();
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].date >= products[i + 1].date).toBe(true);
    }
  });
});



