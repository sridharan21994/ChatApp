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

case types.SUGGESTIONS:
    console.log("add list reducer ", action.list);
    return Object.assign({}, state, {list: action.list} )

default:
    return state;
}
}