import * as authService from "../services/authService.js";

const $registerForm = document.forms['registerForm'];
const $loginForm = document.forms['loginForm'];

function redirectRouter(url){
    this.window.location.href = url;
}

(function(){
    setFunctions();
})

function setFunctions(){
    let $signUp = document.querySelector("#signUp");
    $signUp.onclick = register;

    let $signIn = document.querySelector("signIn");
    $signIn.onclick = login;
}

function register(){
    let name = $registerForm["nome"].value;
    let lastName = $registerForm["sobrenome"].value;
    let email = $registerForm["email"].value;
    let password = $registerForm["senha"].value;
    
    const user = {
        "firstName": name,
        "lastName": lastName,
        "email": email,
        "password": password,
        "role":"admin"
    };

    authService.signUp(user);
}

function login(){
    let email = $loginForm["email"].value;
    let password = $loginForm["senha"].value;
    
    const user = {
        "email": email,
        "password": password
    };
    
    authService.signIn(user);
}
