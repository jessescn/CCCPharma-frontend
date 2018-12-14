const url = "https://shielded-headland-49703.herokuapp.com/products";

// WORKING
export async function products(){
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

// NOT WORKING
async function getProduct(id){
    const response = await fetch(url + "/" + id);
    const json = await response.json();
    return json;
}


// NOT WORKING
async function addProduct(){
    const response = await fetch(url,{method:'POST', body: {
        "id": 1,
        "name": "Soap",
        "producer": "Clean it all S.A.",
        "barcode": "1111-2000",
        "price": 1.99,
        "amount": 100,
        "available": true,
        "category": {
            "id": 1,
            "name": "Medicamentos",
            "discount": 0
        }
    }
    });

    const json = await response.json();
    
    return json;
}

export { addProduct, getProduct, products };

