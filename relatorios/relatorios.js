const $productForm = document.forms['productForm'];

let currentProducts = [{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 2,"name": "Higiene Pessoal","discount": 0}},
{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 1,"name": "Higiene Pessoal","discount": 0}},
{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 2,"name": "Higiene Pessoal","discount": 0}},
{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 2,"name": "Higiene Pessoal","discount": 0.4}},
{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 2,"name": "Higiene Pessoal","discount": 0}},
{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 2,"name": "Higiene Pessoal","discount": 0}},
{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 2,"name": "Higiene Pessoal","discount": 0}},
{"id": 2,"name": "Perfume","producer": "KY","barcode": "100002","price": 52.59,"available": false,"category": {"id": 2,"name": "Higiene Pessoal","discount": 0}}];


function addProduct(){
    let name = $productForm['nome'].value;
    let price = $productForm['preco'].value;
    let manufacturer = $productForm['fabricante'].value;
    let situation = $productForm['lote'].value;
    let category = $productForm['categoria'].value;

    const product = {
        "name": name,
        "producer":manufacturer,
        "price":price,
        "avaliable": situation,
        "category":{
            "id": category,
            "name": categoriaNome(category),
            "discount": 0
        }
    }
    return product;
}

function categoriaNome(id){
    let categorias = ["","Medicamentos","Higiene Pessoal","Cosméticos","Alimentos"];
    return categorias[id];
}

function povoateTable(){
    listaDeVendas.forEach(produto => {})
}

function povoateGeneralRelactory(){
    
}










// {
//     "id": 3,
//     "amount": 10,
//     "expiration": "01-01-2018",
//     "product": {
//         "id": 2,
//         "name": "Perfume",
//         "producer": "KY",
//         "barcode": "100002",
//         "price": 52.59,
//         "available": false,
//         "category": {
//             "id": 2,
//             "name": "Higiene Pessoal",
//             "discount": 0
//         }
//     }
// }{
//     "id": 3,
//     "amount": 10,
//     "expiration": "01-01-2018",
//     "product": {
//         "id": 2,
//         "name": "Perfume",
//         "producer": "KY",
//         "barcode": "100002",
//         "price": 52.59,
//         "available": false,
//         "category": {
//             "id": 2,
//             "name": "Higiene Pessoal",
//             "discount": 0
//         }
//     }
// }


