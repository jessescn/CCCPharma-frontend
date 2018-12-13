const $registerForm = document.forms['registerForm'];
const $loginForm = document.forms['loginForm'];

function register(){
    let name = $registerForm["nome"].value;
    let lastName = $registerForm["sobrenome"].value;
    let email = $registerForm["email"].value;
    let password = $registerForm["senha"].value;
    
    const user = {
        nome: name,
        sobrenome: lastName,
        email: email,
        senha: password
    }    
    return user;
}

function login(){
    let email = $loginForm["email"].value;
    let password = $loginForm["senha"].value;
    
    const user = {
        email: email,
        senha: password
    }    
    return user;
}
