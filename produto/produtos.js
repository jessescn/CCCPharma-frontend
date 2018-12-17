import * as productService from '../services/productsService.js';
import * as authService from '../services/authService.js';

const $container = document.querySelector(".tabela");

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
            <span id="title-nome-produto">
                Nome do produto
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-categoria">
                Categoria
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-quantidade">
                Quantidade
                <i class="fas fa-sort"></i>
            </span>
            <span id="title-price">
                Preço
                <i class="fas fa-sort"></i>
            </span>
            <span>
                Alterar preço
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
    window.location.href = "/"
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
    let spanName = document.querySelector("#title-nome-produto");
    let spanCategory = document.querySelector("#title-categoria");
    let spanQuantity = document.querySelector("#title-quantidade");
    let spanPrice = document.querySelector("#title-price");

    spanName.onclick = sortByName;
    spanCategory.onclick = sortByCategory;
    spanQuantity.onclick = sortByQuantity;
    spanPrice.onclick = sortByPrice;
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

let lessToMoreQuantity = true;
function sortByQuantity() {
    if (lessToMoreQuantity) {
        all_products.sort((e1, e2) => e1.amount - e2.amount);
        lessToMoreQuantity = false;
    } else {
        all_products.sort((e1, e2) => e2.amount - e1.amount);
        lessToMoreQuantity = true;
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
        <span>${product.name}</span>
        <span>${product.category.name}</span>
        <span>${product.amount}</span>
        <span>R$ ${product.price}</span>
        <a class="btn-alterar" value="${product.id}" data-fancybox data-touch="false" href="#alterar">
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
