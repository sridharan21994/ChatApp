import React from 'react';
import Auth from '../modules/Auth';
import Dashboard from '../components/Dashboard.jsx';
import { connect } from "react-redux";
import * as actions from "../actions/actions.js";
import { bindActionCreators } from "redux";
import axios from "axios";

class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      data: ''
    };  
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentWillMount() {
  //  axios.get("/socket/check",{headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}}).then().catch();

    axios.get("/api/dashboard",{headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}})
        .then(response=>{
            if ((response.status >= 200 && response.status <= 300) || response.status == 304) {
            console.log("axios: ", response, "this ", this);
            this.props.actions.initializeUser(response.data.user);
            return true;
            }
        })
        .catch(error=>{throw(error);});
    // const xhr = new XMLHttpRequest();
    // xhr.open('get', '/api/dashboard');
    // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // // set the authorization HTTP header
    // xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    // xhr.responseType = 'json';
    // xhr.addEventListener('load', () => {
    //   if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304) {
    //     console.log("setting the data: "+xhr.response.user.email)
    //     // this.setState({
    //     //   userData: xhr.response.user
    //     //         });
    //     this.props.actions.initializeUser(xhr.response.user)
    //   }
    // });
    // xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
    return (<Dashboard userData={this.props.data} />);
  }

}
function mapStateToProps(state, ownProps){
      console.log("dashboard user details from store ", state.myStore);
   return {
     data: state.myStore
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
