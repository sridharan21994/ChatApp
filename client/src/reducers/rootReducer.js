import {combineReducers} from "redux";
import chats from "./tempReducer.js";
const rootReducer=combineReducers({
    chats
});
export default rootReducer;