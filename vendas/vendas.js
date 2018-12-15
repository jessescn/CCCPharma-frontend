import * as orderService from '../services/ordersService.js';
import * as productsService from '../services/productsService.js';

const $vendas  = document.getElementsByClassName("tabela")[0];
let vendas = [];
let produtos = [];
let carrinho = [];

(function(){
    orderService.orders()
    .then(orders => {
        vendas = orders;
        addFunctions();
    })
    .then(() =>{
        povoarVendas();
    })
})();


(function(){
    productsService.products().then(products => {
        produtos = products;
        setOptions(products);
    }) 
})();

function novaVenda(){
    carrinho = [];
}

function addFunctions(){    
    let $addProduct = document.querySelector("#add-produto");
    let $chooseProduct = document.querySelector("#select-products");

    let id = $chooseProduct.value;
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

// POVOAR TABELA VENDAS FUNCIONANDO !!
function povoarVendas(){
    vendas.forEach(venda => {
        let $venda = document.createElement("div");

        $venda.innerHTML = `    
            <span>${venda.id}</span>
            <span>${venda.numberOfProducts}</span>
            <span>R$ ${venda.price.toFixed(2)}</span>
            <i class="fas fa-window-close fa-lg delete"></i>
        `
        $venda.classList.add("linha");
        $vendas.appendChild($venda);
    })
}

// ADICIONAR ITENS AO SELECT FUNCIONANDO !!
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
