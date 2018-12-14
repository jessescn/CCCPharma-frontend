function submitForm(url, form){
    fetch(url, {
        method: 'PUT',
        body: form

    }).then(response => response.json())
}

function submitLogin(loginForm){
    let url = "";
    submitForm(url, loginForm)
    .then((json) =>
    {
        console.log(json + " logado com sucesso!");
    })
    .catch(error => error);
}

function submitRegister(registerForm){
    let url = "";
    submitForm(url, registerForm)
    .then((json) =>
    {
        console.log(json + "registrado com sucesso!");
    })
    .catch(error => error);
}

module.exports = {
    register : submitRegister,
    login: submitLogin
}
