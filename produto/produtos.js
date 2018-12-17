import * as productService from '../services/productsService.js';
import * as authService from '../services/authService.js';

let $container = document.querySelector(".tabela");

let all_products = [];
let categories = [];

function init() {
    verifyPermission();
    loadCategories();
    loadProducts();
    setupListeners();
    setupSorters();
}

function reDesignTable() {
    clearTable();
    populate();
    setupSorters();
    setupChangeListener();
}

function clearTable(){

    while( $container.childNodes.length > 0){       
        $container.removeChild($container.lastChild);
    };

    $container.innerHTML = "";

    let template = `
        <header class="linha">
            <span id="title-barcode">
                Código de barra
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-product-name">
                Nome do produto
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-producer">
                Fabricante
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-category">
                Categoria
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-amount">
                Quantidade
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-price">
                Preço
                <i class="fas fa-sort"></i>
            </span>
            <span>
                Editar
            </span>
        </header>
     `;

    let $header = $(template);

    $header.appendTo($container);
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
    window.location.href = url;
}

function setupListeners() {
    const $btnAdicionar = document.querySelector("#adicionar input[type=submit]");
    $btnAdicionar.onclick = saveProduct;

    const $btnDiscount = document.querySelector("#promocao input[type=submit]");
    $btnDiscount.onclick = addDiscount;

    const $signOut = document.querySelector("#signOut");
    $signOut.onclick = signOut;
}

function setupChangeListener() {
    let $changePriceBtns = document.getElementsByClassName("btn-alterar");
    
    for(let i = 0; i < $changePriceBtns.length; i++){
        let $changePrice = $changePriceBtns[i];
        
        let id = parseInt($changePrice.attributes.value.value);
        $changePrice.onclick = function() { showModalWithId(id); };
    }
}

function loadProducts() {
    productService.products().then(function(data) {
        all_products = data;
        console.log("finished");
        populate();
        setupChangeListener();
    });
 }

function setupSorters() {
    let spanBarcode = document.querySelector("#title-barcode");
    let spanName = document.querySelector("#title-product-name");
    let spanCategory = document.querySelector("#title-category");
    let spanProducer = document.querySelector("#title-producer");
    let spanAmount = document.querySelector("#title-amount");
    let spanPrice = document.querySelector("#title-price");

    spanName.onclick = sortByName;
    spanCategory.onclick = sortByCategory;
    spanAmount.onclick = sortByAmount;
    spanPrice.onclick = sortByPrice;
    spanProducer.onclick = sortByProducer;
    spanBarcode.onclick = sortByBarcode;
}

let lessToMoreBarcode = true;
function sortByBarcode() {
    if(lessToMoreBarcode) {
        all_products.sort((e1, e2) => e1.barcode.localeCompare(e2.barcode));
        lessToMoreBarcode = false;
    } else {
        all_products.sort((e1, e2) => e2.barcode.localeCompare(e1.barcode));
        lessToMoreBarcode = true;
    }
    reDesignTable();
}

let lessToMoreName = true;
function sortByName() {
    if(lessToMoreName) {
        all_products.sort((e1, e2) => e1.name.localeCompare(e2.name));
        lessToMoreName = false;
    } else {
        all_products.sort((e1, e2) => e2.name.localeCompare(e1.name));
        lessToMoreName = true;
    }
    reDesignTable();
}

let lessToMoreProducer = true;
function sortByProducer() {
    if(lessToMoreProducer) {
        all_products.sort((e1, e2) => e1.producer.localeCompare(e2.producer));
        lessToMoreProducer = false;
    } else {
        all_products.sort((e1, e2) => e2.producer.localeCompare(e1.producer));
        lessToMoreProducer = true;
    }
    reDesignTable();
}

let lessToMoreCategory = true;
function sortByCategory() {
    if (lessToMoreCategory) {
        all_products.sort((e1, e2) => e1.category.name.localeCompare(e2.category.name));
        lessToMoreCategory = false;
    } else {
        all_products.sort((e1, e2) => e2.category.name.localeCompare(e1.category.name));
        lessToMoreCategory = true;
    }
    reDesignTable();
}

let lessToMoreAmount = true;
function sortByAmount() {
    if (lessToMoreAmount) {
        all_products.sort((e1, e2) => e1.amount - e2.amount);
        lessToMoreAmount = false;
    } else {
        all_products.sort((e1, e2) => e2.amount - e1.amount);
        lessToMoreAmount = true;
    }
    reDesignTable();
}

let lessToMorePrice = true;
function sortByPrice() {
    if (lessToMorePrice) {
        all_products.sort((e1, e2) => e1.price - e2.price);
        lessToMorePrice = false;
    } else {
        all_products.sort((e1, e2) => e2.price - e1.price);
        lessToMorePrice = true;
    }
    reDesignTable();
}

function loadCategories() {
    productService.categories().then(function(data){
        categories = data;
    });
}

function appendProduct(product) {
    let template = `
    <div class="linha">
        <span>${product.barcode}</span>
        <span>${product.name}</span>
        <span>${product.producer}</span>
        <span>${product.category.name}</span>
        <span>${product.amount}</span>
        <span>R$ ${product.price.toFixed(2)}</span>
        <span>
            <a class="btn-alterar" value="${product.id}" data-fancybox data-touch="false" href="#alterar">
                <i class="fas fa-marker"></i>
            </a>
        </span>
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
    let barcode = getModalValue("adicionar", "barcode");

    let categoryIndex = document.querySelector("#adicionar .select-categoria").selectedIndex;
    let category = categories[categoryIndex];

    const product = {
        "name": name,
        "producer": producer,
        "barcode": barcode,
        "price": price,
        "amount": amount,
        "category": category
    };

    productService.addProduct(product);
    $.fancybox.close(true);

    setTimeout(function () {
        location.reload()
    }, 300);
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

function getProductById(id) {
    return all_products.filter(function (element) { return element.id == id });
}

function showModalWithId(id) {
    let product = getProductById(id);

    let $titleModal = document.querySelector("#alterar h3");
    const $btnAlterar = document.querySelector("#alterar input[type=submit]");

    $titleModal.innerHTML = `Alterar preço de ${product[0].name}`;
    console.log("antes da alteração");
    console.log(product);

    $btnAlterar.onclick = function() {
        changePriceProduct(product);
    };
}

function changePriceProduct(product) {
    const $newPrice = getModalValue("alterar", "nome");

    if ($newPrice && !isNaN($newPrice)) {
        product[0].price = $newPrice;
        console.log(product);
        productService.updateProduct(product[0]);
    }

    $.fancybox.close(true);
    
    setTimeout(function () {
        location.reload()
    }, 300);
}

init();
