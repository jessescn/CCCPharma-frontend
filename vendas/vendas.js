import * as orderService from '../services/ordersService.js';
import * as productService from '../services/productsService.js';

const $orders  = document.querySelector(".tabela");
const $orderProducts = document.querySelector(".grid-produtos");
const $messageSucess = document.querySelector(".mensagem-sucesso");
const $messageError = document.querySelector(".mensagem-erro");
const $messageCarEmptyError = document.querySelector(".emptyCart-erro")

let all_orders = [];
let cart = [];
let all_products

function init(){
    loadOrders();
    loadProducts();
}

function loadOrders(){
    orderService.orders().then(function(data){
        all_orders = data;
        povoateTable();
        setupDeleteListener();
    })
}

function loadProducts(){
    productService.products().then(function(data){
        all_products = data;
        setOptions();
        setupListeners();
    })
}

function newOrder(){
    let $amount = document.getElementById("amount");
    $amount.value = 0;

    cart = [];
    
    while($orderProducts.childNodes.length > 1){        
        $orderProducts.removeChild($orderProducts.lastChild);
    }

    let template = `   
        <span class="cabecalho">Produto</span>
        <span class="cabecalho">Quantidade</span>
    `
    let $product = $(template);

    $product.appendTo($orderProducts);
}

function redrawTable(id){    
    clearTable(id);
    povoateTable();    
    setupDeleteListener();
}

function clearTable(id){;
      
    while($orders.childNodes.length != 0){        
        $orders.removeChild($orders.firstChild);
    };
        
    const $container = $(".tabela");

    let template = `
    <header class="linha">
         <span>Id da venda</span>
         <span>N° de produtos</span>
         <span>Valor arrecadado</span>
         <span>Cancelar venda</span>
     </header>
     `;

    const $header = $(template);
    $header.appendTo($container);

    for(let i = 0; i < all_orders.length; i++){
        if(all_orders[i].id == id){
            all_orders.splice(i,1);
        }
    }
}

function setupListeners(){
    const $sentOrder = document.getElementById("enviar-venda");
    const $addProduct = document.getElementById("btn-add");
    const $openCart = document.getElementById("btn-prod");
    const $btnProduct = document.getElementById("btn-newOrder");
    const $selectProduct = document.getElementById("select-products");

    $selectProduct.onchange = resetMessages;
    $openCart.onclick = resetMessages;
    $btnProduct.onclick = newOrder;
    $addProduct.onclick = addProductToCart;
    $sentOrder.onclick = sendNewOrder;
}

function resetMessages(){
    $messageSucess.classList.add("escondido");
    $messageError.classList.add("escondido");
    $messageCarEmptyError.classList.add("escondido");
}

function appendProduct(product){
    let template = `   
        <span>${product.product.name}</span>
        <span>${product.quantity}</span>
    `
    let $product = $(template);

    $product.appendTo($orderProducts);
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
    await sumAll(cart);       
    
    if(cart.length > 0){        

        const response = await orderService.addOrder(cart);
        await appendOrder(response);
        setupDeleteListener();
        $.fancybox.close(true);

    }else{
        $messageCarEmptyError.classList.remove("escondido");
    }
}

function sumAll(produtos){
    let total = 0;

    produtos.forEach(produto => {
        total += produto.product.price;
    });

    return total;
}

function povoateTable(){    
    if (all_orders != []) {
        all_orders.forEach(_order => {
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
        <button class="delete-button delete" value=${order.id}>Deletar</button>
    </div>
    `
    let $order = $(template);
    $order.appendTo($orders);   
}

function removeOrder(id){
    orderService.removeOrder(id);
    redrawTable(id);  
}

function setOptions(){
    const $select = document.getElementById("select-products");
    
    all_products.forEach(product =>{
        
        if(product.amount > 0){
            let option = document.createElement("option");
            option.text = product.name;
            option.value = product.id;
            $select.add(option);
        }
    })
}

async function addProductToCart(){
    let $selectProduct = document.getElementById("select-products");
    let $amount = document.getElementById("amount");

    let id = $selectProduct.value;
    let product = await productService.getProduct(id);
    let amount = $amount.value;

    const newProduct = {
        "quantity": parseInt(amount, 10),
        "product": product
    }

    if(amount > 0 && product.amount >= amount){     
        addToCart(newProduct);
        // cart.push(newProduct);
        // appendProduct(newProduct);
        $messageError.classList.add("escondido");
        $messageSucess.classList.remove("escondido");       
    }else{
        $messageError.classList.remove("escondido");
    }
}

function addToCart(newProduct){
    let exist = false;

    cart.forEach(product => {
        if(product.product.id == newProduct.product.id){            
            exist = true;
            product.quantity += newProduct.quantity;
        }
    })

    if(!exist){   
        cart.push(newProduct);
        appendProduct(newProduct);
    }
}

init();
