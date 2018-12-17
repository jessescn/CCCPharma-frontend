import * as orderService from '../services/ordersService.js';
import * as authService from '../services/authService.js';

const $orders = document.querySelector(".tabela");
let all_orders = [];


/*
* Make the request to the backend, and start some initial functions.
*/
function init() {
    verifyPermission();
    setupListeners();
    orderService.infoOrders().then(function (data) {
        all_orders = data;
        loadOrders();
    });
}

/*
* Function that starts setProducts for each element of the array.
*/
function loadOrders() {
    all_orders.forEach(function (order) {
        setProducts(order);
    });
}

/*
*    Set the functions call in html components
*/
function setupListeners() {
    const $signOut = document.querySelector("#signOut");
    $signOut.onclick = signOut;
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
* Create a template that represent the general information and add to HTML
*/
function setProducts(orderInfo) {
    let available = "Indisponível";

    if (orderInfo.product.available) {
        available = "Disponível";
    }

    let template = `
    <div class = "linha">
        <span>${orderInfo.product.name}</span>
        <span>${orderInfo.product.amount}</span>
        <span>${available}</span>
        <span>${orderInfo.quantity}</span>
        <span>R$ ${orderInfo.totalPrice}</span>
    </div>
    `

    let $line = $(template);
    $line.appendTo($orders);
}

init();