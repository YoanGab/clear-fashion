const service = require('../service');


describe('service.searchProducts()', () => {
    it('should return an array of length < limit of products from a brand below a price', async () => {
        service.searchProducts({
            brand: 'loom',
            price: 100,
            limit: 10
        }).then(products => {
            expect(products.length).toBeLessThanOrEqual(10);
            expect(products.every(product => product.brand === 'loom')).toBe(true);
            expect(products.every(product => product.price <= 100)).toBe(true);
        });
    });
});


describe('service.getProduct()', () => {
    it('should return the product with id "678384c9-20bd-5151-9e1a-382984501eb8"', async () => {
        service.getProductById('678384c9-20bd-5151-9e1a-382984501eb8').then(product => {
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
});
