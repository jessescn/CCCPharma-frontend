const api = "https://cccpharma-api-jjlm.herokuapp.com";
const url = api + "/products";

/**
 * 'POST' request to provide all products to front
 */
async function products(){
    const response = await fetch(url);

    try{
        const json = await response.json();
        return json;
    }catch(e){
        console.log(e);
    }  
}

/**
 * 'GET' request to provide a especific item by id
 */
async function getProduct(id){
    const produtoUrl = url + "/" + id; 
    const response = await fetch(produtoUrl);
    const json = await response.json();

    return json;
}

/**
 * 'POST' request to add a new item 
 */
async function addProduct(produto){
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
    }
    const response = await fetch(url,config);
    const json = await response.json(); 

    return json;

}

/**
 * 'PUT' request to update a especific product
 */
async function updateProduct(produto){
    const config = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
    }

    const produtoUrl = url + "/" + produto.id; 
    const response = await fetch(produtoUrl, config);
    const json = await response.json();

    return json;

}

/**
 * 'GET' request to provide all categories to front
 */
async function categories(){
    const response = await fetch("https://cccpharma-api-jjlm.herokuapp.com/categories");
    try{
        const json = await response.json();
        return json;

    }catch(e){
        return "Não foram encontradas categorias";
    }
}

/**
 * 'PUT' request to add a discount to especific category
 */
async function addDiscount(category){
    const categoryUrl = `https://cccpharma-api-jjlm.herokuapp.com/categories/${category.id}`;
    const config = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
    }

    const response = await fetch(categoryUrl,config);
    const json = await response.json();
    return json;
}


export { addProduct, getProduct, products, updateProduct, categories, addDiscount };

