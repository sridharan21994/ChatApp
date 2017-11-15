import * as types from "./types.js";

export function initializeUser(userDetail){
    console.log("calling intiliase user actions", userDetail);
    return { type: types.INITIALIZE_USER, userDetail }
}

export function addMessage(message){
            console.log("add message action ", message);
    return {
        type: types.ADD_MESSAGE, message
    }
}
