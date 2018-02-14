import * as types from "../actions/types.js";
import initialState from "./initialState";

export default function tempReducer (state=initialState, action) {
switch(action.type){

case types.INITIALIZE_USER:
    console.log("init reducer ", action.userDetail);  
    return Object.assign({}, state, {userDetail: {"name":action.userDetail.name, "email": action.userDetail.email,"fb_details":action.userDetail.fb_details },
                                     threadList: action.userDetail.threadList,
                                     contactList: action.userDetail.contactList,
                                     activeThread: action.userDetail.activeThread,
                                     friendsList: action.userDetail.friendsList
                                    } );
    
case types.ADD_MESSAGE:
console.log("reducer add message: ",action.data);
    for(let i = 0; i<state.contactList.length;i++ ){
        if(state.contactList[i].convo_id===action.data.convo_id){
             action.data.newContent= state.contactList[i];
             action.data.newContent.lastMessage= action.data.message;
             action.data.newContent.unread= action.data.unread;
             action.data.newIndex= i;
             break;
        }
    }

    return Object.assign({}, state, 
        {threadList: state.threadList.map((content, index)=> (content.convo_id===action.data.convo_id) ? 
        Object.assign({}, content, {message:[...content.message,action.data.message]})
        :content)},
        {contactList: [ action.data.newContent, ...state.contactList.slice(0, action.data.newIndex), ...state.contactList.slice( action.data.newIndex+1)]});      

case types.UPDATE_UNREAD:
    return Object.assign({},state, 
        {contactList: state.contactList.map((content, index)=> (content.convo_id===action.data.convo_id) ? 
        Object.assign({}, content, {unread: false})
        :content)})        

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
    return Object.assign({}, state, {activeThread: action.data});  
    
case types.PUSH_NEW_THREAD:
    return Object.assign({}, state, {threadList:[action.data, ...state.threadList]});

case types.ADD_BLOCKED_LIST:
    return Object.assign({}, state, {blockedList: [...state.blockedList, action.data]});    

case types.REMOVE_BLOCKED_USER:
    return Object.assign({}, state, {contactList: state.contactList.filter((content,index)=>content.convo_id!==action.data.convo_id)},  
     {threadList: state.threadList.filter((content,index)=>content.convo_id!==action.data.convo_id)});  

case types.ADD_FRIENDSLIST:
console.log("reducer", action.data);
     return Object.assign({}, state, {friendsList: action.data});

case types.NEW_FB_THREAD:
    return Object.assign({}, state, {contactList: state.contactList.map((content,index)=>(content.fb_id===action.data.fb_id)?
    Object.assign({}, content, action.data )
    :content)
});

case types.CHANGE_MOBILE_TAB:
    return Object.assign({}, state, {mobileTab: action.data.value});

default:
    return state;
}
}