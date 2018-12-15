const url = "https://cccpharma-api-jjlm.herokuapp.com/products";

// WORKING GET ALL PRODUCTS
async function products(){
    const response = await fetch(url);

    try{
        const json = await response.json();
        return json;
    }catch(e){
        console.log(e);
    }  
}

// WORKING GET PRODUCT
async function getProduct(id){
    const produtoUrl = url + "/" + id; 
    const response = await fetch(produtoUrl);
    const json = await response.json();

    return json;
}


// WORKING ADD PRODUCT
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

// WORKING UPDATE PRODUCT
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

// NOT WORKING REMOVE PRODUCT (SERVER NOT SUPPORTED)
async function deleteProduct(id){
    const config = {
        method: 'DELETE'
    }

    const produtoUrl = url + "/" + produto.id;
    const response = await fetch(produtoUrl,config);
    const json = await response.json();

    return json;

}

// WORKING GET CATEGORIES
async function categories(){
    const response = await fetch("https://cccpharma-api-jjlm.herokuapp.com/categories");
    try{
        const json = await response.json();
        return json;

    }catch(e){
        return "Não foram encontradas categorias";
    }
}


export { addProduct, getProduct, products, updateProduct, categories};

