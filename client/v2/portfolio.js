// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// Available variables
let availableBrands = []

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = "";
let currentMaxPrice = -1;
let currentSort = "";
let filterReasonablePrice = false;
let filterRecentlyReleased = false;


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const sortBy = document.querySelector('#sort-select');
const inputMaxPrice = document.querySelector('#max-price');
const buttonMaxPrice = document.querySelector('#max-price-button');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 * @param brand
 */
const setCurrentProducts = ({result, meta}) => {
    currentProducts = result;
    currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @param  {String}  [brand='All brands'] - brand to filter
 * @param  {Number}  [price=-1] - price to filter
 * @param  {String}  [sort='price-asc'] - sort by
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand='All brands', price=-1, sort='price-asc') => {
    try {
        const url = `https://server-eta-henna.vercel.app/products/search/?page=${page}&limit=${size}&brand=${brand}&price=${price}&sort=${sort}`
        const response = await fetch(url);
        const body = await response.json();

        if (body.success !== true) {
            console.error(body);
            return {currentProducts, currentPagination};
        }

        return body.data;
    } catch (error) {
        console.error(error);
        return {currentProducts, currentPagination};
    }
};


/**
 * Get all brands from api
 * @return {Array}
 */
const fetchBrands = async () => {
    try {
        const url = `https://server-eta-henna.vercel.app/brands`
        const response = await fetch(url);
        const body = await response.json();

        if (body.success !== true) {
            console.error(body);
            return {availableBrands};
        }
        console.log(body.data);
        return body.data;
    } catch (error) {
        console.error(error);
        return {availableBrands};
    }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = products
        .map(product => {
            return `
              <div class="product" id=${product.uuid}>
                <span>${product.brand}</span>
                <a href="${product.link}">${product.name}</a>
                <span>${product.price}</span>
              </div>
            `;
        })
        .join('');
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
    console.log(pagination);
    const {currentPage, pageCount} = pagination;
    selectPage.innerHTML = Array.from(
        {'length': pageCount},
        (value, index) => `<option value="${index + 1}">${index + 1}</option>`
    ).join('');
    selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
    const {count} = pagination;

    spanNbProducts.innerHTML = count;
};


/**
 * Render page selector
 * @param  {Object} products
 */
const renderBrands = products => {
    const brands = availableBrands.filter((brand, index, array) => array.indexOf(brand) === index);
    selectBrand.innerHTML = `<option value="">All</option>`;
    selectBrand.innerHTML += brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');
    selectBrand.value = currentBrand;
};

const render = (products, pagination) => {
    renderProducts(products);
    renderPagination(pagination);
    renderIndicators(pagination);
    renderBrands(products);
};

/**
 * Declaration of all Listeners
 */
selectShow.addEventListener('change', async (event) => {
    const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

selectBrand.addEventListener('change', async (event) => {
    currentBrand = event.target.value;
    const products = await fetchProducts(
        1,
        currentPagination.pageSize,
        currentBrand,
        currentMaxPrice,
        currentSort
    )


    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
    const products = await fetchProducts(
        parseInt(event.target.value),
        currentPagination.pageSize,
        currentBrand,
        currentMaxPrice,
        currentSort
    );

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

sortBy.addEventListener('change', async (event) => {
    currentSort = event.target.value;
    const products = await fetchProducts(
        1,
        currentPagination.pageSize,
        currentBrand,
        currentMaxPrice,
        currentSort
    );

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});


buttonMaxPrice.addEventListener('click', async () => {
    currentMaxPrice = parseInt(inputMaxPrice.value);
    const products = await fetchProducts(
        1,
        currentPagination.pageSize,
        currentBrand,
        currentMaxPrice,
        currentSort
    );

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
    availableBrands = await fetchBrands();
    const products = await fetchProducts();

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

