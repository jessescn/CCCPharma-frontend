import * as orderService from '../services/ordersService.js';
import * as authService from '../services/authService.js';

const $orders = document.querySelector(".tabela");
let all_orders = [];

function init() {
    verifyPermission();
    setupListeners();
    orderService.orders().then(function (data) {
        console.log(data);
        all_orders = data;
        loadOrders();
    });
}

function loadOrders() {
    all_orders.forEach(function (order) {
        setProducts(order.orderProducts);
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

function setProducts(products) {
    products.forEach(function (product) {
        let prices = getAmount(product.product.id, products);
        let available = "Indisponível";

        if (product.product.available) {
            available = "Disponível";
        }

        let nSale = prices[0];
        let income = prices[1];

        let template = `
        <div class = "linha">
            <span>${product.product.name}</span>
            <span>${product.product.amount}</span>
            <span>${available}</span>
            <span>${nSale}</span>
            <span>R$ ${income}</span>
        </div>
        `

        let $line = $(template);
        $line.appendTo($orders);
    })
}

// function isAvailable(product) {
//     if(product.product.available) {
//         return "Disponível";
//     } else {
//         return "Indisponível";
//     }
// }

function getAmount(id, orders) {
    let salesData = [0, 0];
    let ident = id;

    orders.forEach(function (element) {
        if (element.product.id == ident) {
            salesData[0] += element.quantity;
            salesData[1] += element.totalPrice;
        }
    });

    return salesData;
}

// function generateLine(product) {
//     let prices = getAmount(product.product.id, products);
//     let nSale = prices[0];
//     let income = prices[1];

//     let template = `
//         <div class = "linha">
//             <span>${product.product.name}</span>
//             <span>${product.product.amount}</span>
//             <span>${product.product.available}</span>
//             <span>${nSale}</span>
//             <span>R$ ${income}</span>
//         </div>
//         `

//     let $line = $(template);
//     $line.appendTo($orders);
// }


init();