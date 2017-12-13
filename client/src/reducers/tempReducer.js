import * as types from "../actions/types.js";
import initialState from "./initialState";

export default function tempReducer (state=initialState, action) {
switch(action.type){

case types.INITIALIZE_USER:
    console.log("init reducer ", action.userDetail);  
    return Object.assign({}, state, {userDetail:action.userDetail} );
    
case types.ADD_MESSAGE:
    console.log("add message reducer ", action.message);
    // if(state["message"]==undefined||state["message"]==null){
    //     Object.assign({}, state, {message:[""]} );
    //     console.log("***************",state);
    // }
    return Object.assign({}, state, {message: [...state.message,action.message]} );

case types.ADD_SUGGESTIONS:
    return Object.assign({}, state, {searchList: action.list} );

case types.ADD_CONTACTS:
    return Object.assign({}, state, {contactList: [...state.contactList,action.list]});   

case types.UPDATE_ACTIVE_THREAD:
    return Object.assign({}, state, {activeThread: action.thread_id});    

default:
    return state;
}
}