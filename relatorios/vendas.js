import * as orderService from '../services/ordersService.js';

const $vendaForm = document.forms['productForm'];
const $vendas  = document.querySelector("#produtos");
let vendas = [];

(function(){
    orderService.orders()
    .then(orders => {
        vendas = orders;
    }).then(() =>{ 
        povoarVendas();
        setFunctions();
    })
})();

// function removerVenda(){
//     console.log("ola");
//     //orderService.removeOrder(id);
// }

function setFunctions(){
    const $botao = document.querySelector(".formulario__botao");
    $botao.onclick = addVenda;
}


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

function Venda(){
    
}



