import {addProduct, getProduct, products} from './services/productsService.js';

const $produtos = document.querySelector(".products-container");

// async function products(){
//     const response = await fetch("https://shielded-headland-49703.herokuapp.com/products");
//     const json = await response.json();
//     return json;
// }

let allProducts = [];

let currentProducts = [];

/* init home */

(function(){
    populateHome();
    filterProducts();
    products().then(response => allProducts = response);
})();

function update(){
    filterProducts();
    populateHome();
}

function filterProducts(){
    let $messageNotFound = document.querySelector("#not-found-message");
    $messageNotFound.classList.remove("desaparecer");

    let filteredProducts = [];
    let indexCategory = document.getElementById("input-categoria").selectedIndex;

    allProducts.forEach(product =>
        {
            if(product.category.id == indexCategory || indexCategory == 0){
                filteredProducts.push(product);
            }
        });

    currentProducts = filteredProducts;

    if(currentProducts.length > 0){
        $messageNotFound.classList.add("desaparecer");
    }
}

function redirectRouter(url){
    this.window.location.href= url;
}


function populateHome(){

    while ($produtos.firstChild) {
        $produtos.removeChild($produtos.firstChild);
    }
    
    currentProducts.forEach(element => {
        let $product = document.createElement("div");
        
        let discountPrice = calculateDiscount(element.price, element.category.discount);

        if(element.category.discount > 0){
            $product.innerHTML = `
                <div class="desconto"> -${element.category.discount * 100}%</div>
                <img class="imagem-produto" src="img/${element.category.id}.jpg">
                <p class="nome">${element.name}</p>
                <p><spam class="preco-antigo">De: R$ ${element.price} </spam>
                <spam class="preco-atual">Por: R$${discountPrice}</spam></p>
                <div class="escolha" onclick = "redirectRouter('index.html')">Selecionar</div>
            `
        }else{
            $product.innerHTML = `
                <img class="imagem-produto" src="img/${element.category.id}.jpg">
                <p class="nome">${element.name}</p>
                <p class="preco-antigo"></p>
                <p class="preco-atual">R$ ${element.price}</p>
                <div class="escolha" onclick = "redirectRouter('index.html')">Selecionar</div>
            `
        }
        $product.classList.add("produto");
        $produtos.appendChild($product);
    });
};

function calculateDiscount(price,discount){
    return (price - (price * discount)).toFixed(2);
}
