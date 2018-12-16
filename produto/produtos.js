import * as productService from '../services/productsService.js';
import * as authService from '../services/authService.js';

let all_products = [];
let categories = [];

function init() {
    verifyPermission();
    loadCategories();
    loadProducts();
    setupListeners();
    // populateSelectChangePrice();
}

function signOut() {
    if (authService.isAuth()) {
        authService.signOut();
        sendTo("/");
    }
}

function verifyPermission() {
    if (!authService.isAuth() || !authService.currentUserIsAdmin()) sendTo("/");
}

function sendTo(url) {
    window.location.href = "/"
}

function setupListeners() {
    const $btnAdicionar = document.querySelector("#adicionar input[type=submit]");
    $btnAdicionar.onclick = saveProduct;

    const $btnDiscount = document.querySelector("#promocao input[type=submit]");
    $btnDiscount.onclick = addDiscount;

    const $btnAlterar = document.querySelector("#alterar input[type=submit]");
    $btnAlterar.onclick = changePriceProduct;

    const $signOut = document.querySelector("#signOut");
    $signOut.onclick = signOut;
}

function loadProducts() {
    productService.products().then(function(data) {
         all_products = data;
         populate();
    }).then(function() {
        populateSelectChangePrice();
        // função para popular o select de alterar preço
    });
 }

 function populateSelectChangePrice() {
    let productsSelect = document.querySelector('#products-select');

    all_products.forEach(element => {
        let option = document.createElement("option");
        option.text = element.name;
        productsSelect.add(option);
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
        <!-- <a data-fancybox data-touch="false" href="#alterar">
            <i class="fas fa-marker"></i>
        </a> -->
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

function changePriceProduct() {
    const $newPrice = getModalValue("alterar", "nome");
    let productIndex = document.querySelector("#products-select").selectedIndex;

    if ($newPrice && !isNaN($newPrice)) {
        all_products[productIndex].price = $newPrice;
        productService.updateProduct(all_products[productIndex]);
    }

    $.fancybox.close(true);
    location.reload();
}

init();
