const url = "https://cccpharma-api-jjlm.herokuapp.com/orders";

/**
 * Responsible to provide the list of orders to frontend 
 */
function orders() {
    return fetch(url).then(r => r.json());
}

function infoOrders() {
    const newUrl = url + "/info";
    return fetch(newUrl).then(r => r.json());
}

/**
 * 'POST' request to add new order
 */
function addOrder(orderForm) {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderForm)
    }

    return fetch(url, config).then(r => r.json());
}

/**
 * 'DELETE' request to remove a especific order 
 */
function removeOrder(orderId){
    const removeUrl = url + "/" + orderId;
    const config = {
        method: 'DELETE'
    };
    try{
        fetch(removeUrl, config);
        return "ok";
    }catch(e){
        return "erro de rede";
    }
}

export { orders, infoOrders , addOrder, removeOrder };