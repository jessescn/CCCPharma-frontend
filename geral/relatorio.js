import * as orderService from '../services/ordersService.js';

const $orders = document.querySelector(".tabela");
let all_orders = [];

function init() {
    orderService.orders().then(function (data) {
        all_orders = data;
        loadOrders();
    });
}

function loadOrders() {
    all_orders.forEach(function (order) {
        setProducts(order.orderProducts);
    });
}

function setProducts(products) {
    products.forEach(function (product) {
        let prices = getAmount(product.product.id, products);
        let nSale = prices[0];
        let income = prices[1];

        let template = `
        <div class = "linha">
            <span>${product.product.name}</span>
            <span>${product.product.amount}</span>
            <span>${product.product.available}</span>
            <span>${nSale}</span>
            <span>R$ ${income}</span>
        </div>
        `

        let $line = $(template);
        $line.appendTo($orders);
    })
}

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