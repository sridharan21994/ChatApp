import { createStore, applyMiddleware }  from "redux";
import rootReducer from "../reducers/rootReducer.js";
//import reduxImmutableStateInvariant from "redux-immuatable-state-invariant";

export default function configureStore(initialState){
return createStore(
    rootReducer,
    initialState
   // applyMiddleware(reduxImmutableStateInvariant())
)
}