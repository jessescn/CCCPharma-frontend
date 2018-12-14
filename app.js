import {addProduct, getProduct, products} from './services/productsService.js';

const $produtos = document.querySelector(".products-container");

let allProducts = [];

/* init home */

(function(){
    products().then(response => allProducts = response);
    filterProducts();
    setFunctions();
})();



function update(){
    filterProducts();
}

function setFunctions(){
    let $select = document.querySelector("#input-categoria");
    $select.onchange = update;
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

    
    populateHome(filteredProducts);

    if(filteredProducts.length > 0){
        $messageNotFound.classList.add("desaparecer");
    }
}

function redirectRouter(url){
    this.window.location.href= url;
}


function populateHome(listaProdutos){

    while ($produtos.firstChild) {
        $produtos.removeChild($produtos.firstChild);
    }
    
    listaProdutos.forEach(element => {
        let $produto = document.createElement("div");
        
        let discountPrice = calculateDiscount(element.price, element.category.discount);

        if(element.category.discount > 0){
            $produto.innerHTML = `
                <div class="desconto"> -${element.category.discount * 100}%</div>
                <img class="imagem-produto" src="img/${element.category.id}.jpg">
                <p class="nome">${element.name}</p>
                <p><spam class="preco-antigo">De: R$ ${element.price} </spam>
                <spam class="preco-atual">Por: R$${discountPrice}</spam></p>
                <div class="escolha" onclick = "redirectRouter('index.html')">Selecionar</div>
            `
        }else{
            $produto.innerHTML = `
                <img class="imagem-produto" src="img/${element.category.id}.jpg">
                <p class="nome">${element.name}</p>
                <p class="preco-antigo"></p>
                <p class="preco-atual">R$ ${element.price}</p>
                <div class="escolha" onclick = "redirectRouter('index.html')">Selecionar</div>
            `
        }
        $produto.classList.add("produto");
        $produtos.appendChild($produto);
    });
};

function calculateDiscount(price,discount){
    return (price - (price * discount)).toFixed(2);
}
