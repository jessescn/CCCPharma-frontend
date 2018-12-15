import * as productService from '../services/productsService.js';

let all_products = [];
let categories = [];

function init() {
    loadCategories();
    loadProducts();
    setupListeners();
}

function setupListeners() {
    const $btnAdicionar = document.querySelector("#adicionar input[type=submit]");
    $btnAdicionar.onclick = saveProduct;

    const $btnDiscount = document.querySelector("#promocao input[type=submit]");
    $btnDiscount.onclick = addDiscount;
}

function loadProducts() {
     productService.products().then(function(data) {
        all_products = data;
        populate();
    });
 }

function loadCategories() {
    productService.categories().then(function(data){
        categories = data;
    });
}

function appendProduct(product) {
    const $container = $(".tabela");   
    let template = `
    <div class="linha">
        <span>${product.name}</span>
        <span>${product.category.name}</span>
        <span>${product.amount}</span>
        <span>R$ ${product.price}</span>
        <a data-fancybox data-touch="false" href="#alterar">
            <i class="fas fa-marker"></i>
        </a>
    </div>
    `;
    let $product = $(template);

    $product.appendTo($container);
}

function populate() {
    if (all_products != []) {
        all_products.forEach(product => {
            appendProduct(product);
        });
    }
}

function getModalValue(id, name) {
    let query = `#${id} input[name=${name}]`;
    const $component = document.querySelector(query);
    return $component.value;
}

function saveProduct(){   
    let name = getModalValue("adicionar", "nome");
    let price = getModalValue("adicionar", "preco");
    let producer = getModalValue("adicionar", "fabricante");
    let amount = getModalValue("adicionar", "amount");

    let categoryIndex = document.querySelector("#adicionar .select-categoria").selectedIndex;
    let category = categories[categoryIndex];

    const product = {
        "name": name,
        "producer": producer,
        "barcode": "0000-0000",
        "price": price,
        "amount": amount,
        "category": category
    };

    productService.addProduct(product);
    appendProduct(product);
    // loadProducts();
    $.fancybox.close(true);
}

function addDiscount() {
    const $radio = document.querySelector("#promocao input[type=radio]:checked");
    let discount = $radio.value;
    let categoryIndex = document.querySelector("#adicionar .select-categoria").selectedIndex;
    let category = categories[categoryIndex];
    category.discount = discount;
    productService.addDiscount(category);
    $.fancybox.close(true);
}

init();
