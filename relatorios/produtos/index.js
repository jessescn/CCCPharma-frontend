import { addProduct, getProduct, products} from '../services/productsService.js';

let all_products = [];

products().then(function(data) {
    all_products = data;
    populate();
});

function populate() {
    
}