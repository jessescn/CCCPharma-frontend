import * as authService from "../services/authService.js";

const $registerForm = document.forms['registerForm'];
const $loginForm = document.forms['loginForm'];

function init() {
    if (authService.isAuth()) {
        redirectRouter("/");
    } else {
        setupListeners();
    }
}

function getModalValue(id, name) {
    let query = `.${id} input[name=${name}]`;
    const $component = document.querySelector(query);
    return $component.value;
}

function redirectRouter(url){
    window.location.href = url;
}

function setupListeners() {
    let $signUp = document.querySelector("#signUp");
    $signUp.onclick = register;

    let $signIn = document.querySelector("#signIn");
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
    let email = getModalValue("login", "email");
    let password = getModalValue("login", "senha");

    const user = {
        "email": email,
        "password": password
    };
    
    authService.signIn(user)
    .then(function(success) {
        console.log(success);
        if (success) {
            redirectRouter("/");
        } else {
            console.log("Auth failed");
        }
    });
}

init();