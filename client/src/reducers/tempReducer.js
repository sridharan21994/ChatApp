import * as types from "../actions/types.js";
import initialState from "./initialState";

export default function tempReducer (state=initialState, action) {
switch(action.type){

case types.INITIALIZE_USER:
    console.log("init reducer ", action.userDetail);  
    return Object.assign({}, state, {userDetail: {"name":action.userDetail.name, "email": action.userDetail.email },
                                     threadList: action.userDetail.threadList,
                                     contactList: action.userDetail.contactList } );
    
case types.ADD_MESSAGE:
console.log("reducer add message: ",action.data)
    return Object.assign({}, state, {threadList: state.threadList.map((content, index)=> (content.convo_id===action.data.convo_id) ? 
        Object.assign({}, content, {message:[...content.message,action.data.message]})
        :content)});

case types.ADD_SUGGESTIONS:
    return Object.assign({}, state, {searchList: action.list} );

case types.ADD_CONTACTS:
    return Object.assign({}, state, {contactList: [action.list, ...state.contactList]});   

case types.UPDATE_CONTACT_CONVO_ID:
    return Object.assign({}, state, {contactList: state.contactList.map((content,index)=>(content.email===action.data.email)?
    Object.assign({}, content, action.data )
    :content)
    });

case types.UPDATE_ACTIVE_THREAD:
    return Object.assign({}, state, {activeThread: action.thread_id});  
    
case types.PUSH_NEW_THREAD:
    return Object.assign({}, state, {threadList:[...state.threadList,action.data]})    

default:
    return state;
}
}