import React from 'react';
import Auth from '../modules/Auth';
import { connect } from "react-redux";
import * as actions from "../actions/actions.js";
import { bindActionCreators } from "redux";
import axios from "axios";

class Search extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {};  
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentWillMount() {
    axios.get("/api/dashboard",{headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}})
        .then(response=>{
            if ((response.status >= 200 && response.status <= 300) || response.status == 304) {
            console.log("axios: ", response, "this ", this);
            this.props.actions.initializeUser(response.data.user);
            return true;
            }
        })
        .catch(error=>{throw(error);});
  }

  render() {
    return (<SearchList list={this.props.list} />);
  }

}
function mapStateToProps(state, ownProps){
   return {
     list: state.chats.list
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
