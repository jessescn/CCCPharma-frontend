import * as productService from '../services/productsService.js';

let all_products = [];
let categories = [];
const $productForm = document.forms['productForm'];


productService.products().then(function(data) {
    all_products = data;
    populate();
});

productService.categories().then(function(data){
    categories = data;
})

function populate() {
    if (all_products != []) {
        const $container = $("#produtos");

        all_products.forEach(product => {
            let template = `
            <div>
                <span>${product.id}</span>
                <span>${product.name}</span>
                <span>${product.category.name}</span>
                <span>${product.price}</span>
                <a data-fancybox data-touch="false" href="#alterar">
                    <i class="fas fa-marker"></i>
                </a>
            </div>
            `;
            let $product = $(template);
            $product.appendTo($container);
        });
    }
}

(function(){
    populate();
   $productForm.onsubmit = adicionarProduto;
})

export function adicionarProduto(){
    console.log("ooo");
    
    let nome = $productForm["nome"].value;
    let preco = $productForm["preco"].value;
    let fabricante = $productForm["fabricante"].value;
    let barcode = "1111-2000";
    let $categoriaIndex = document.getElementById("select-categoria").selectedIndex;
    let categoria = categories[$categoriaIndex - 1];

    const produto = {
        "name": nome,
        "producer": fabricante,
        "barcode": "0000-0000",
        "price": preco,
        "amount": 100,
        "category": categoria
    };

    productService.addProduct(produto);
}




