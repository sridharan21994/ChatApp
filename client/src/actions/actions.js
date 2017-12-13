import * as types from "./types.js";
// import axios from "axios";
// import Auth from '../modules/Auth';

export function initializeUser(userDetail){
    console.log("calling intiliase user actions", userDetail);
    return { type: types.INITIALIZE_USER, userDetail };
}

export function addSuggestions(list){
    return { type: types.ADD_SUGGESTIONS, list };
}

export function addContactList(list){
    return { type: types.ADD_CONTACTS, list};
}

export function updateActiveThread(thread_id){
    return{ type: types.UPDATE_ACTIVE_THREAD, thread_id};
}

export function addMessage(message){
            console.log("add message action ", message);
    return {
        type: types.ADD_MESSAGE, message
    };
}

// export function loadPage(){
//         return axios.get("/api/dashboard",{headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}})
//         .then(response=>{
//             if ((response.status >= 200 && response.status <= 300) || response.status == 304) {
//             console.log("axios: ", response, "this ", this);
//             initializeUser(response.data.user);
//             return true;
//             }
//         })
//         .catch(error=>{throw(error);});
// }