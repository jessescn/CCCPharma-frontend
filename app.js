import {addProduct, getProduct, products} from './services/productsService.js';
import * as authService from "./services/authService.js";

const $produtos = document.querySelector(".products-container");

let allProducts = [];

function init() {
    setupPermissions();
    setupListeners();
}

function setupPermissions() {
    if (authService.isAuth()) {
        $(".authenticated").show("fast");
        $(".non-authenticated").hide("fast");

        if (authService.currentUserIsAdmin()) {
            $(".admin").show("fast");
        } else {
            $(".admin").hide("fast");
        }
    } else {
        $(".authenticated").hide("fast");
        $(".non-authenticated").show("fast");
        $(".admin").hide("fast");
    }
}

function setupListeners() {
    let $signOut = document.querySelector("#signOut");
    $signOut.onclick = signOut;
}

function signOut() {
    if (authService.isAuth()) {
        authService.signOut();
        setupPermissions();
    }
}

/* init home */

(function(){ 
     products().then(function(response){
         allProducts = response;
         populateHome(allProducts);
         setFunctions(); 
   })
})()


function setFunctions(){
    let $buttons = document.getElementsByClassName("btn-filter");
    
    for(let i = 0; i < $buttons.length; i++){

        let id = parseInt($buttons[i].attributes.value.value);      
        $buttons[i].onclick = function(){resetAllMarks(); filterProducts(id); $buttons[i].classList.add("active")};
        
    }
}

function resetAllMarks(){
    let $buttons = document.getElementsByClassName("btn-filter");
    
    for(let i = 0; i < $buttons.length; i++){     
        $buttons[i].classList.remove("active");
        
    }
}

function filterProducts(id){
    let $messageNotFound = document.querySelector("#not-found-message");
    $messageNotFound.classList.remove("desaparecer");

    let filteredProducts = [];

    allProducts.forEach(product =>
        {   
            console.log(product.category.id + " : "  + id);
            
            if(product.category.id == id || id == 0){
                filteredProducts.push(product);
            }
        });

    
    populateHome(filteredProducts);
     
    if(filteredProducts.length > 0){
        $messageNotFound.classList.add("desaparecer");
    }
}

function populateHome(listaProdutos){

    while ($produtos.firstChild) {
        $produtos.removeChild($produtos.firstChild);
    }
    
    listaProdutos.forEach(element => {        
        let $produto = document.createElement("div");
        
        let discountPrice = calculateDiscount(element.price, element.category.discount);

        if(element.amount > 0){
            if(element.category.discount > 0){
                $produto.innerHTML = `
                    <div class="desconto"> -${element.category.discount * 100}%</div>
                    <img class="imagem-produto" src="img/${element.category.id}.jpg">
                    <p class="nome">${element.name}</p>
                    <p><spam class="preco-antigo">De: R$ ${element.price.toFixed(2)} </spam>
                    <spam class="preco-atual">Por: R$${discountPrice}</spam></p>
                    <div class="escolha">Em estoque</div>
                `
            }else{
                $produto.innerHTML = `
                    <img class="imagem-produto" src="img/${element.category.id}.jpg">
                    <p class="nome">${element.name}</p>
                    <p class="preco-antigo"></p>
                    <p class="preco-atual">R$ ${element.price.toFixed(2)}</p>
                    <div class="escolha">Disponível</div>
             `
            }
        }else{
            if(element.category.discount > 0){
                $produto.innerHTML = `
                    <div class="desconto"> -${element.category.discount * 100}%</div>
                    <img class="imagem-produto" src="img/${element.category.id}.jpg">
                    <p class="nome">${element.name}</p>
                    <spam class="preco-atual">-</spam></p>
                    <div class="indisponivel">Indisponivel</div>
                `
            }else{
                $produto.innerHTML = `
                    <img class="imagem-produto" src="img/${element.category.id}.jpg">
                    <p class="nome">${element.name}</p>
                    <p>-</p>
                    <div class="indisponivel">Indisponivel</div>
                `
            }

        }
        $produto.classList.add("produto");
        $produtos.appendChild($produto);
    });
};

function calculateDiscount(price,discount){
    return (price - (price * discount)).toFixed(2);
}

init();