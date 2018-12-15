import {addProduct, getProduct, products} from '../services/productsService.js';

let all_products = [];

products().then(function(data) {
    all_products = data;
    populate();
});

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