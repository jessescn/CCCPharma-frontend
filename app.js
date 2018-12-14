const $produtos = document.querySelector(".products-container");

const produtoEx = [{nome: "sabonete", preco: 99, precoDesconto: 55, desconto: 50},
    {nome: "sabonete", preco: 99, precoDesconto: 55, desconto: 50},
    {nome: "sabonete", preco: 99, precoDesconto: 55, desconto: 50},
    {nome: "sabonete", preco: 99, precoDesconto: 55, desconto: 50},
    {nome: "sabonete", preco: 99, precoDesconto: 55, desconto: 50},
    {nome: "sabonete", preco: 99, precoDesconto: 55, desconto: 50}];


function redirectRouter(url){
    this.window.location.href= url;
}

(function(){
    produtoEx.forEach(element => {
        let $produto = document.createElement("div");
        $produto.innerHTML = `
            <div class="desconto"> -${element.desconto}%</div>
            <img class="imagem-produto" src="img/remedio-generico.jpg">
            <p class="nome">${element.nome}</p>
            <p class="preco-antigo">De: R$ ${element.precoDesconto},00 </p>
            <p class="preco-atual">Por: R$ ${element.preco},00</p>
            <div class="escolha" onclick = "redirectRouter('index.html')">Selecionar</div>
        `
        $produto.classList.add("produto");
        $produtos.appendChild($produto);
    });
})();