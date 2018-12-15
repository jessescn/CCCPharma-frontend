import * as orderService from '../services/ordersService.js';
import * as productsService from '../services/productsService.js';

const $vendaForm = document.forms['productForm'];
const $vendas  = document.querySelector("#produtos");
let vendas = [];

(function(){
    orderService.orders()
    .then(orders => {
        vendas = orders;
    }).then(() => { 
        povoarVendas();
        productsService.products().then(products => {
            setOptions(products);
        }) 
    })
})();


function povoarVendas(){
    vendas.forEach(venda => {
        let $venda = document.createElement("div");

        $venda.innerHTML = `    
            <span>${venda.id}</span>
            <span>100</span>
            <span>${venda.numberOfProducts}</span>
            <span>${venda.price}</span>
            <i class="fas fa-window-close fa-lg delete"></i>
        `
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

// function adicionarVenda(){
//     let $vendaForm
// }





