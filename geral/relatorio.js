import * as orderService from '../services/ordersService.js';
import * as authService from '../services/authService.js';

const $orders = document.querySelector(".tabela");
let all_orders = [];

function init() {
    verifyPermission();
    setupListeners();
    orderService.ordersInfo().then(function (data) {
        all_orders = data;
        loadOrders();
    });
}

function loadOrders() {
    all_orders.forEach(function (order) {
        setProducts(order);
    });
}

function setupListeners() {
    const $signOut = document.querySelector("#signOut");
    $signOut.onclick = signOut;
}

function signOut() {
    if (authService.isAuth()) {
        authService.signOut();
        sendTo("/");
    }
}

function verifyPermission() {
    if (!authService.isAuth() || !authService.currentUserIsAdmin()) sendTo("/");
}

function sendTo(url) {
    window.location.href = "/"
}

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