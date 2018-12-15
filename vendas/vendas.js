import * as orderService from '../services/ordersService.js';
import * as productsService from '../services/productsService.js';

const $vendas  = document.getElementsByClassName("tabela")[0];
const $messageSucess = document.getElementsByClassName("mensagem-sucesso")[0];
const $messageError = document.getElementsByClassName("mensagem-erro")[0];
let vendas = [];
let cart = [];

function init(){
    setupListeners();
    loadOrders();
    loadProducts();
}

function loadOrders(){
    orderService.orders().then(function(orders){
        vendas = orders;
        povoateOrders();
    })
}

function loadProducts(){
    productsService.products().then(function(products){
        setOptions(products);
    })
}

function newOrder(){ 
    cart = [];
}

function setupListeners(){
    let $sentOrder = document.querySelector("#enviar-venda");
    let $addProduct = document.querySelector("#add-produto");
    let $openCart = document.querySelector("#add-prod");
    let $addProductButton = document.querySelector("#add-venda");

    $openCart.onclick = function(){$messageSucess.classList.add("escondido"); $messageError.classList.add("escondido")};
    $addProductButton.onclick = newOrder;
    $addProduct.onclick = addProductToCart;
    $sentOrder.onclick = sendNewOrder;

}

async function sendNewOrder(){
    let precoTotal = await sumAll(cart);

    const venda = {
        "price": precoTotal,
        "productOrders": cart
    }

    console.log(venda);
    
    let response = await orderService.addOrder(cart);
    console.log(response);
    $.fancybox.close(true);
}


function sumAll(produtos){
    let total = 0;

    produtos.forEach(produto => {
        total += produto.product.price;
    });

    return total;
}

function povoateOrders(){
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

function setOptions(produtos){
    const $select = document.getElementById("select-products");
    
    produtos.forEach(produto =>{

        let option = document.createElement("option");
        option.text = produto.name;
        option.value = produto.id;
        $select.add(option);
    })
}

async function addProductToCart(){
    let $chooseProduct = document.querySelector("#select-products");
    let $amount = document.querySelector("#amount");

    let id = $chooseProduct.value;
    let produto = await productsService.getProduct(id);
    let amount = $amount.value;

    const novoProduto = {
        "quantity": parseInt(amount, 10),
        "product": produto
    }

    if(produto.name != undefined && amount){        
        cart.push(novoProduto);
    }
    
    if(!amount){
        $messageError.classList.remove("escondido");
    }else{
        $messageError.classList.add("escondido");
        $messageSucess.classList.remove("escondido");
    }
    
}

init();