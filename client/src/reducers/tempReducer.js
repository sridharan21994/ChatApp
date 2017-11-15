import * as types from "../actions/types.js";

export default function tempReducer (state={message:[]},action) {
switch(action.type){

case types.INITIALIZE_USER:
    console.log("init reducer ", action.userDetail);  
    return Object.assign({}, state, {userDetail:action.userDetail} );
    
case types.ADD_MESSAGE:
    console.log("add message reducer ", action.message.text);
    if(!state.message){
    //    Object.assign({}, state, {message:[]});
               console.log("***************");
    }
    return Object.assign([...state.message,action.message.text]
        );

default:
    return state;
}
}