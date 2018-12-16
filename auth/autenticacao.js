import * as authService from "../services/authService.js";

function init() {
    if (authService.isAuth()) {
        redirectRouter("/");
    } else {
        setupListeners();
    }
}

function getInfo(name) {
    let query = `#form input[name=${name}]`;
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

function showMessage(msg, status) {
    const $msg = document.querySelector("#form .message");
    console.log($msg);
    $msg.classList.remove("hidden");
    $msg.classList.remove("error");
    $msg.classList.remove("success");
    $msg.classList.add(status);

    $msg.innerText = msg;
}

function register(){
    console.log("register");
    let email = getInfo("email");
    let password = getInfo("password");
    
    const user = {
        "email": email,
        "password": password,
    };

    authService.signUp(user)
    .then(function(success) {
        console.log(success);
        if (success) {
            showMessage("Conta criada com sucesso", "success");
        } else {
            showMessage("Falha ao criar conta. Verifique seus dados.", "error")
        }
    }).catch(function(error) {
        console.log(error);
    });
}

function login(){
    let email = getInfo("email");
    let password = getInfo("password");

    const user = {
        "email": email,
        "password": password
    };
    
    authService.signIn(user)
    .then(function(success) {
        if (success) {
            redirectRouter("/");
        } else {
            showMessage("A autenticação falhou! Por favor, verifique seus dados.", "error");
        }
    });
}

init();