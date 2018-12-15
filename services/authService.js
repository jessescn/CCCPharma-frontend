const url = "https://cccpharma-api-jjlm.herokuapp.com/users";

// WORKING SIGN-UP
async function signUp(registerForm){
    const config = {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm)
    }
    const registerUrl = url + "sign-up"; 
    const response = await fetch(registerUrl, config);
    const json = response.json();

    return json;
}

// WORKING SIGN-IN (SERVER ERROR VALIDATION PASSWORD)
async function signIn(loginForm){
    const config = {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
    }
    const loginUrl = url + "sign-in";
    const response = await fetch(loginUrl,config);
    const json  = await response.json();

    return json;
   
}

export { signIn, signUp };