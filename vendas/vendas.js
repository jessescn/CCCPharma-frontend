import * as orderService from '../services/ordersService.js';
import * as productService from '../services/productsService.js';
import * as authService from "../services/authService.js";

const $orders  = document.querySelector(".tabela");
const $orderProducts = document.querySelector(".grid-produtos");
const $messageSucess = document.querySelector(".mensagem-sucesso");
const $messageError = document.querySelector(".mensagem-erro");
const $messageCarEmptyError = document.querySelector(".emptyCart-erro")


let all_orders = [];
let cart = [];
let all_products = [];

/*
*   Start some initial functions, most of them have request to backend
*/
function init(){
    loadOrders();
    verifyPermission();    
    loadProducts();
    setfilter();    
}

/*
*   Sign out the user and redirect to home
*/
function signOut() {
    if (authService.isAuth()) {
        authService.signOut();
        sendTo("/");
    }
}

/*
*  Verify user permission
*/
function verifyPermission() {
    if (!authService.isAuth() || !authService.currentUserIsAdmin()) sendTo("/");
}

/*
*   Send user to especific url 
*/
function sendTo(url) {
    window.location.href = "/"
}

/*
*   Load Orders from database,
*/  
function loadOrders(){
    orderService.orders().then(function(data){
        all_orders = data;
        povoateTable();
        setupDeleteListener();
    })
}

/*
*    Load products from database, set products as option in cart select 
*/
function loadProducts(){
    productService.products().then(function(data){
        all_products = data;
        setOptions();
        setupListeners();
    })
}

/*
*    Set the functions call in html components
*/
function setupListeners(){
    const $amount = document.getElementById("amount");
    const $sentOrder = document.getElementById("enviar-venda");
    const $addProduct = document.getElementById("btn-add");
    const $openCart = document.getElementById("btn-prod");
    const $btnProduct = document.getElementById("btn-newOrder");
    const $selectProduct = document.getElementById("select-products");
    const $signOut = document.querySelector("#signOut");

    $amount.onchange = resetMessages;
    $selectProduct.onchange = resetMessages;
    $openCart.onclick = resetMessages;
    $btnProduct.onclick = newOrder;
    $addProduct.onclick = addProductToCart;
    $sentOrder.onclick = sendNewOrder;
    $signOut.onclick = signOut;
}

/*
*   Initialize new order, set cart to [] and reset the table
*/
function newOrder(){
    let $amount = document.getElementById("amount");
    $amount.value = 0;
    cart = [];    
    reset();
}

/*
*   Reset the table and add the header
*/
function reset(){
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

/*
*   Reset the table after some change, cleaning the html, repovoate and setup listeners
*/
function redrawTable(id){    
    clearTable();
    removeFromList(id);
    povoateTable();    
    setupDeleteListener();
    setfilter();
}

function redraw(){    
    clearTable();
    povoateTable();    
    setupDeleteListener();
    setfilter();
}

/**
 *  Remove all html related to '$order' and remove order from 'all_orders'
 */
function clearTable(){
    
    while($orders.childNodes.length > 0){       
        $orders.removeChild($orders.lastChild);
    };
        
    const $container = $(".tabela");
    $container.innerHTML = "";

    let template = `
    <header class="linha">
         <span id="date" class="header">Data da venda <i class="fas fa-sort"></i></span>
         <span id="total-amount" class="header">Quantidade de itens<i class="fas fa-sort"></i></span>
         <span id="income" class="header">Receita arrecadada<i class="fas fa-sort"></i></span>
         <span>Mais informações</span>
         <span>Cancelar venda</span>
     </header>
     `;

    let $header = $(template);

    $header.appendTo($container);
}

function removeFromList(id){
    let index = 0;

    for(let i = 0; i < all_orders.length; i++){
        if(all_orders[i].id == id){
            index = i;
        }
    }

    all_orders.splice(index,1);
}

/*
*   Reset all alert messages to 'escondido'
*/
function resetMessages(){
    $messageSucess.classList.add("escondido");
    $messageError.classList.add("escondido");
    $messageCarEmptyError.classList.add("escondido");
}

/*
*   Append HTML template representing a product in a order table (little car)
*/
function appendProduct(product){
    let template = `   
        <span>${product.product.name}</span>
        <span>${product.quantity}</span>
    `
    let $product = $(template);

    $product.appendTo($orderProducts);
}

/*
*  Set the orders to "lister" the function removerOrder()
*/
function setupDeleteListener(){
    let $details =  document.getElementsByClassName("details-btn");
    let $deleteOrders = document.getElementsByClassName("delete-button");

    for(let i = 0; i < $deleteOrders.length; i++){
        
        let $order = $deleteOrders[i];
        let id = parseInt($order.attributes.value.value);
        $order.onclick = function(){ removeOrder(id)};

    }

    for(let j = 0; j < $details.length; j++){
        
        let $detail = $details[j];
        let id = parseInt($detail.attributes.value.value);      
        $detail.onclick = function(){ showDetails(id) };
    }


}

/*
*  create the order and send the new order to backend
*/
async function sendNewOrder(){    
    if(cart.length > 0){        

        const response = await orderService.addOrder(cart);
        await appendOrder(response);
        all_orders.push(response);
        setupDeleteListener();
        $.fancybox.close(true);

    }else{
        $messageCarEmptyError.classList.remove("escondido");
    }
}


/**
 * Povoate the orders table
 */
function povoateTable(){
    if (all_orders != []) {
        all_orders.forEach(_order => {
            appendOrder(_order);
        });
    }
}

/**
 * Create a template representing the order and add to HTML ($order)  
 */
function appendOrder(order){
    
    let template = `
    <div class = "linha">    
        <span>${order.dateCreated}</span>
        <span>${order.numberOfProducts}</span>
        <span>R$ ${order.price.toFixed(2)}</span>
        <a class="details-btn" value=${order.id} data-fancybox data-touch="false" href="#details-order">
            <i class="fas fa-list-ul"></i>
        </a>
        <a class="delete-button delete" value=${order.id}>
            <i class="fas fa-minus-circle"></i>
        </a>
    </div>
    `
    let $order = $(template);
    $order.appendTo($orders);   
}

/**
 * Remove a especific order by id and redraw a table with the changes 
 */
async function removeOrder(id){
    await orderService.removeOrder(id);
    redrawTable(id);  
}

/**
 * Set as option all the database products in add new product to cart 'select'    
 */
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

/**
 * Add new product to cart (little car)
 */
async function addProductToCart(){
    resetMessages();
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
        await addToCart(newProduct);
        updateCart();
        $messageError.classList.add("escondido");
        $messageSucess.classList.remove("escondido");       
    }else{
        $messageError.classList.remove("escondido");
    }
}

/**
 * Update cart with new changes (if user add more units to the same product)
 */
function updateCart(){
    reset();
    cart.forEach(product =>{
        appendProduct(product);
    }); 
}

/**
 * Add the product to a cart 
 */
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

    let $amount = document.getElementById("amount");
    $amount.value = 0; 
}

/*
* Show the list of products of a especific order   
*/
function showDetails(id){ 

    let productDetails = [];
    let order = "";

    all_orders.forEach(_order =>{
        if(_order.id == id){
            order = _order;
        }
    })
    
    order.orderProducts.forEach(product =>{
        let details  = {
            name: product.product.name,
            quantity: product.quantity
        }
        productDetails.push(details);
    })

    auxDetails(productDetails);

}

/**
 * Aux function for showDetails 
 */
function auxDetails(details){
    let $detailsOrder = document.querySelector("#details-order");

    while($detailsOrder.childNodes.length > 0){
        $detailsOrder.removeChild($detailsOrder.lastChild);
    }

    let header = `<div>
        <span class="header-line">Nome</span>
        <span class="header-line">Quantidade</span>
    </div>`;

    let $header = $(header);
    $header.appendTo($detailsOrder);


    details.forEach(detail =>{
        let template = `
        <div>
            <span class="line">${detail.name}</span>
            <span class="line">${detail.quantity}</span>
        </div>
        `;

        let $detail = $(template);
        $detail.appendTo($detailsOrder);
    })
}

/**
 * Set sort option to table 
 */
function setfilter(){
    let $date = document.getElementById("date");
    let $amount = document.getElementById("total-amount");
    let $income = document.getElementById("income");

    $date.onclick = filterByDate;
    $amount.onclick = filterByAmount;
    $income.onclick = filterByIncome;
}

/**
 * Set sort by create date 
 */
let lessToMore1 = true;
function filterByDate(){
    if(lessToMore1){
        all_orders.sort(function(a,b) {return b.id - a.id});
        lessToMore1 = false;
    }else{
        all_orders.sort(function(a,b) {return a.id - b.id});
        lessToMore1 = true;
    }
    redraw();
}

/**
 * Set sort by itens quantity
 */
let lessToMore2 = true;
function filterByAmount(){
    if(lessToMore2){
        all_orders.sort(function(a,b) {return b.numberOfProducts - a.numberOfProducts});
        lessToMore2 = false; 
    }else{
        all_orders.sort(function(a,b) {return a.numberOfProducts - b.numberOfProducts});
        lessToMore2 = true;
    }   
    redraw();
    
}

/**
 * Set sort by total income
 */
let lessToMore3 = true;
function filterByIncome(){
    if(lessToMore3){
        all_orders.sort(function(a,b) {return b.price - a.price});
        lessToMore3 = false;
    }else{
        all_orders.sort(function(a,b) {return a.price - b.price}); 
        lessToMore3 = true;
    }    
    redraw();
}

init();
