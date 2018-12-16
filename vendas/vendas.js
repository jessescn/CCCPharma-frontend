import * as orderService from '../services/ordersService.js';
import * as productsService from '../services/productsService.js';

const $orders  = document.querySelector(".tabela");
const $messageSucess = document.querySelector(".mensagem-sucesso");
const $messageError = document.querySelector(".mensagem-erro");

let orders = [];
let cart = [];

function init(){
    loadProducts();
    loadOrders();
}

function loadOrders(){
    orderService.orders().then(function(ordersList){
        orders = ordersList;
        povoateOrders();
    }).then(function(){setupDeleteListener()});
}

function loadProducts(){
    productsService.products().then(function(products){
        setOptions(products);
    }).then(function(){setupListeners()});
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

function setupDeleteListener(){
    let $deleteOrders = document.getElementsByClassName("delete-button");

    for(let i = 0; i < $deleteOrders.length; i++){
        
        let $order = $deleteOrders[i];
        let id = $order.value;
        $order.onclick = function(){ removeOrder(id) };
    }
    
}

async function sendNewOrder(){
    let precoTotal = await sumAll(cart);

    const venda = {
        "price": precoTotal,
        "productOrders": cart
    }
    
    orderService.addOrder(cart);
    $.fancybox.close(true);
    appendOrder(venda);
}


function sumAll(produtos){
    let total = 0;

    produtos.forEach(produto => {
        total += produto.product.price;
    });

    return total;
}

function povoateOrders(){

    if (orders != []) {
        orders.forEach(_order => {
            appendOrder(_order);
        });
    }
}

function appendOrder(order){
    let template = `
    <div class = "linha">    
        <span>${order.id}</span>
        <span>${order.numberOfProducts}</span>
        <span>R$ ${order.price.toFixed(2)}</span>
        <button class="delete-button delete" value=${order.id}>Deletar venda</button>
    </div>
    `
    let $order = $(template);

    $order.appendTo($orders);
}

function removeOrder(id){

    for(let i = 0; i < orders.length; i++){
        if(orders[i].id == id){
            orders.splice(i,1);
        }
    }

    orderService.removeOrder(id);
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