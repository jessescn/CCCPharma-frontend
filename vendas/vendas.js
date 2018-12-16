import * as orderService from '../services/ordersService.js';
import * as productService from '../services/productsService.js';

const $orders  = document.querySelector(".tabela");
const $orderProducs = document.querySelector(".grid-produtos");
const $messageSucess = document.querySelector(".mensagem-sucesso");
const $messageError = document.querySelector(".mensagem-erro");

let all_orders = [];
let cart = [];
let all_products

async function init(){
    await loadOrders();
    loadProducts();
}

function loadOrders(){
    orderService.orders().then(function(data){
        all_orders = data;
        povoateOrders();
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
    cart = [];
    while($orderProducs.childNodes.length != 1){        
        $orderProducs.removeChild($orderProducs.lastChild);
    }
    appendFirst();
}

function setupListeners(){
    const $sentOrder = document.querySelector("#enviar-venda");
    const $addProduct = document.querySelector("#add-produto");
    const $openCart = document.querySelector("#add-prod");
    const $addProductButton = document.querySelector("#add-venda");
    const $chooseProduct = document.querySelector("#select-products");

    $chooseProduct.onchange = resetMessages;
    $openCart.onclick = resetMessages;
    $addProductButton.onclick = newOrder;
    $addProduct.onclick = addProductToCart;
    $sentOrder.onclick = sendNewOrder;
}

function resetMessages(){
    $messageSucess.classList.add("escondido");
    $messageError.classList.add("escondido");
}
function appendFirst(){
    let template = `   
        <span class="cabecalho">Produto</span>
        <span class="cabecalho">Quantidade</span>
    `
    let $product = $(template);

    $product.appendTo($orderProducs);
}

function appendProduct(product){
    let template = `   
        <span>${product.product.name}</span>
        <span>${product.quantity}</span>
    `
    let $product = $(template);

    $product.appendTo($orderProducs);

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
    let totalPrice = await sumAll(cart);    

    const order = {
        "price": totalPrice,
        "productOrders": cart
    }
    
    const response = await orderService.addOrder(cart);
    console.log(response);
    
    appendOrder(response);
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

async function removeOrder(id){
    await orderService.removeOrder(id);
    removeFromTable(id);
}

function removeFromTable(id){
    $orders.childNodes.forEach(order =>{
        if(order.id == id){
            $order.removeChild(order);
        }
    })
}

function setOptions(){
    const $select = document.getElementById("select-products");
    
    all_products.forEach(produto =>{
        
        if(produto.amount > 0){
            let option = document.createElement("option");
            option.text = produto.name;
            option.value = produto.id;
            $select.add(option);
        }
    })
}

async function addProductToCart(){
    let $chooseProduct = document.querySelector("#select-products");
    let $amount = document.querySelector("#amount");

    let id = $chooseProduct.value;
    let product = await productService.getProduct(id);
    let amount = $amount.value;

    const newProduct = {
        "quantity": parseInt(amount, 10),
        "product": product
    }

    await appendProduct(newProduct);

    if(!amount || product.amount < amount || amount < 0){        
        $messageError.classList.remove("escondido");
    }else{
        cart.push(newProduct);
        $messageError.classList.add("escondido");
        $messageSucess.classList.remove("escondido");
    }
}

init();
