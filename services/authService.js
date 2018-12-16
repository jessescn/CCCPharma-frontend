const url = "https://cccpharma-api-jjlm.herokuapp.com";

/**
 * 
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

    // IF SUCCESS
    let success = false;
    if (json.id) 
        success = true;
    return success;
}

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

export function signOut() {
    sessionStorage.clear();
}

export function isAuth() {
    var auth = false;
    if (sessionStorage.getItem("currentUser"))
        auth = true;
    return auth;
}

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

// export { signIn, signUp, isAuth, signOut };