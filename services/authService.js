const url = "https://cccpharma-api-jjlm.herokuapp.com";

// WORKING SIGN-UP
// async function signUp(registerForm){
//     const config = {
//         method:'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(registerForm)
//     }
//     const registerUrl = url + "sign-up"; 
//     const response = await fetch(registerUrl, config);
//     const json = response.json();

//     return json;
// }

// WORKING SIGN-IN (SERVER ERROR VALIDATION PASSWORD)

export async function signIn(loginForm){
    const config = {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
    }
    const loginUrl = url + "/auth";
    const response = await fetch(loginUrl,config);
    const json  = await response.json();

    // IF SUCCESS
    let success = false;
    if (json.id) {
        success = true;
        sessionStorage.setItem("currentUser", loginForm.email);
        sessionStorage.setItem("isAdmin", json.admin);
    }

    return success;
}

// function signIn(loginForm) {
//     if (loginForm.email == "admin@admin.com" && loginForm.password == "admin") {
//         sessionStorage.setItem("currentUser", "admin@admin.com");
//     }
// }

// function signUp(loginForm) {}

// function signOut() {
//     sessionStorage.clear();
// }

export function isAuth() {
    var auth = false;
    if (sessionStorage.getItem("currentUser"))
        auth = true;
    return auth;
}

// export { signIn, signUp, isAuth, signOut };