const url = "https://cccpharma-api-jjlm.herokuapp.com";

/**
 * Responsible to provide the register informations to backend
 */
export async function signUp(registerForm){
    console.log(registerForm);
    const config = {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm)
    }
    const registerUrl = url + "/signup"; 
    const response = await fetch(registerUrl, config);
    const json = await response.json();

    let success = false;
    if (json.id) 
        success = true;
    return success;
}

/**
 * Responsible to provide the login informations to backend 
 */
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

/**
 * Responsible to logout the user to system
 */
export function signOut() {
    sessionStorage.clear();
}

/**
 * Responsible to verify if have some user logged
 */
export function isAuth() {
    var auth = false;
    if (sessionStorage.getItem("currentUser"))
        auth = true;
    return auth;
}

/**
 * Responsible to verify if the current user is an admin
 */
export function currentUserIsAdmin() {
    let response = false;
    if (isAuth()) {
        let isAdmin = sessionStorage.getItem("isAdmin") == "true";
        if (isAdmin) {
            response = true;
        }
    }
    return response;
}
