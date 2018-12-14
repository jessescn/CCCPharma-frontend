const url = "https://cccpharma-api-jjlm.herokuapp.com/products";

// WORKING GET ALL PRODUCTS
async function products(){
    const response = await fetch(url);
    if(response.ok){
        const json = await response.json();
        return json;  
    }else{
        throw new Error("Nenhum produto encontrado");
    }
}

// WORKING GET PRODUCT
async function getProduct(id){
    let produtoUrl = url + "/" + id; 
    const response = await fetch(produtoUrl);
    if(response.ok){
        const json = await response.json();
        return json;
    }else{
        throw new Error("Nenhum produto encontrado")
    }
}


// WORKING ADD PRODUCT
async function addProduct(produto){
    const response = await fetch(url,{method:'POST', body: produto});
    if(response.ok){
        const json = await response.json(); 
        return json;
    }else{
        throw new Error("Erro ao adicionar produto");
    }
}

// WORKING UPDATE PRODUCT
async function updateProduct(produto){
    let produtoUrl = url + "/" + produto.id; 
    const response = await fetch(produtoUrl, {method: 'PUT', body: produto});
    if(response.ok){
        const json = await response.json();
        return json;
    }else{
        throw new Error("Produto não existe");
    }
}

// NOT WORKING REMOVE PRODUCT (SERVER ERROR)
async function deleteProduct(id){
    let produtoUrl = url + "/" + produto.id;
    const response = await fetch(produtoUrl,{method:'DELETE'});
    if(response.ok){
        const json = await response.json();
        return json;
    }else{
        throw new Error("Produto não existe");
    }
}

// WORKING GET CATEGORIES
async function categories(){
    const response = await fetch("https://cccpharma-api-jjlm.herokuapp.com/categories");
    if(response.ok){
        const json = await response.json();
        return json;
    }else{
        throw new Error("Erro ao acessar categorias");
    }
}


export { addProduct, getProduct, products, updateProduct, deleteProduct, categories};







// {
//     "id": 1,
//     "name": "Soap",
//     "producer": "Clean it all S.A.",
//     "barcode": "1111-2000",
//     "price": 1.99,
//     "amount": 100,
//     "available": true,
//     "category": {
//         "id": 1,
//         "name": "Medicamentos",
//         "discount": 0
//     }
// }