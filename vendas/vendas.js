import * as orderService from '../services/ordersService.js';
import * as productsService from '../services/productsService.js';

const $vendaForm = document.forms['productForm'];
const $vendas  = document.querySelector("#produtos");
let vendas = [];
let produtos = [];
let carrinho = [];

(function(){
    orderService.orders()
    .then(orders => {
        vendas = orders;
        addFunctions();
    }).then(() => { 
        povoarVendas();
        productsService.products().then(products => {
            produtos = products;
            setOptions(products);
        }) 
    })
})();

function novaVenda(){
    carrinho = [];
}

function addFunctions(){    
    let $addOrder = document.querySelector("#add-order");
    $addOrder.onclick = novaVenda;

    let $addProduct = document.querySelector("#add-produto");
    let $chooseProduct = document.querySelector("#select-products");

    $chooseProduct.value = id;
    let selectedProduct = getProduct(id);
    $addProduct.onclick = function(){ adicionaItemAoCarrinho(selectedProduct); };

}


function getProduct(id){
    produtos.forEach(produto =>
    {
        if(produto.id == id){
            return produto;
        }
    })
}


function povoarVendas(){
    vendas.forEach(venda => {
        let $venda = document.createElement("div");

        $venda.innerHTML = `    
            <span>${venda.id}</span>
            <span>100</span>
            <span>${venda.numberOfProducts}</span>
            <span>${venda.price}</span>
            <i class="fas fa-window-close fa-lg delete"></i>
        `
        $vendas.appendChild($venda);
    })
}

function setOptions(produtos){
    const $select = document.getElementById("select-products");
    
    produtos.forEach(produto =>{

        let option = document.createElement("option");
        option.text = produto.name;
        option.value = produto.id;
        $select.add(option);
    })
}


function adicionaItemAoCarrinho(produto,amount){
    console.log("entro");
    
    const $carrinho = document.querySelector("grid-produtos");

    let $produto = document.createElement("div");

    $produto.innerHTML = `
                <span>${produto.name}</span>
                <span>${amount}</span>
    `

    $produto.classList.add("" + produto.id);
    $carrinho.appendChild($produto);

    let novoProduto = {
        nome: produto.name,
        id: produto.id,
        amount: amount
    }

    carrinho.push(novoProduto);
}

function removeItemDoCarrinho(id){
    let classe = "" + id;

    const $carrinho = document.querySelector("grid-produtos");
    let childs = $carrinho.childNodes;

    for(let i = 0; i < childs.length; i++){
        if(childs[i].classList[0] == classe){
            childs.splice(i,1);
        }
    }

    $carrinho.childNodes = childs;

    let produtos = carrinho;

    for(let i = 0; i < produtos.length; i++){
        if(produtos[i].id == id){
            produtos.splice(i,1);
        }
    }

    carrinho = produtos;
}






