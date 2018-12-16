import * as authService from "../services/authService.js";

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
    console.log("register");
    let email = getModalValue("cadastro", "email");
    let password = getModalValue("cadastro", "senha");
    
    const user = {
        "email": email,
        "password": password,
    };

    authService.signUp(user)
    .then(function(success) {
        console.log(success);
        if (success) {
            console.log("Signup ok!")
            redirectRouter("/");
        } else {
            console.log("Signup failed");
        }
    }).catch(function(error) {
        console.log(error);
    });
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