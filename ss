}

function setupDeleteListener(){
    let $deleteOrders = document.getElementsByClassName("delete-button");
    console.log($deleteOrders);

    for(let i = 0; i < $deleteOrders.length; i++){
        
        let $order = $deleteOrders[i];
        let id = $order.value;
        
        $order.onclick = function(){ removeOrder(id) };
    }
    

}
