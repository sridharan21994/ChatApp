import * as types from "./types.js";

// import axios from "axios";
// import Auth from '../modules/Auth';

export function initializeUser(userDetail){
    console.log("calling intiliase user actions", userDetail);
    if((userDetail.threadList.length>0)&&(userDetail.contactList.length>0)){

        userDetail.contactList.sort(function (a, b){
            return ((new Date(a.lastMessage.time)) < (new Date(b.lastMessage.time))) ? 1 : (((new Date(b.lastMessage.time)) < (new Date(a.lastMessage.time))) ? -1 : 0);} );
        if(isDesktop){
            userDetail.activeThread= userDetail.contactList[0];
            updateUnread({ convo_id: userDetail.contactList[0].convo_id });
            // userDetail.contactList[0].read=true;
        }else{
            userDetail.activeThread={};
        }
    }else{
    userDetail.activeThread={};
    }
    if(userDetail.fb_details&&userDetail.fb_details.friendsList){
        userDetail.friendsList=userDetail.fb_details.friendsList;
        delete userDetail.fb_details.friendsList;
    }else{
        userDetail.friendsList=[];
    }
    return { type: types.INITIALIZE_USER, userDetail };
}

export function addSuggestions(list){
    return { type: types.ADD_SUGGESTIONS, list };
}

export function addContactList(list){
    return { type: types.ADD_CONTACTS, list};
}

export function updateContactConvoId(data){
    return { type: types.UPDATE_CONTACT_CONVO_ID, data }    
}

export function updateActiveThread(data){
    return { type: types.UPDATE_ACTIVE_THREAD, data};
}

export function addMessage(data){
    console.log("add message action ", data);
    return {type: types.ADD_MESSAGE, data};
}

export function updateUnread(data){
    return { type: types.UPDATE_UNREAD, data};
}

export function pushNewThread(data){
    return { type: types.PUSH_NEW_THREAD, data }
}

export function addBlockedList(data){
    return { type: types.ADD_BLOCKED_LIST, data }
}

export function removeBlockedUser(data){
    return { type: types.REMOVE_BLOCKED_USER, data }
}

export function addFriendsList(data){
    return { type: types.ADD_FRIENDSLIST, data }
}

export function newFbThread(data){
    return { type: types.NEW_FB_THREAD, data }
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