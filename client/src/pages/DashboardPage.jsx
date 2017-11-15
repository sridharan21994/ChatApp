import React from 'react';
import Auth from '../modules/Auth';
import Dashboard from '../components/Dashboard.jsx';
import { connect } from "react-redux";
import * as actions from "../actions/actions.js";
import { bindActionCreators } from "redux";


class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      userDetail: ''
    };  
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentWillMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304) {
        console.log("setting the data: "+xhr.response.user.email)
        // this.setState({
        //   userData: xhr.response.user
        //         });
        this.props.actions.initializeUser(xhr.response.user)
      }
    });
    xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
    return (<Dashboard userData={this.props.userDetail} />);
  }

}
function mapStateToProps(state, ownProps){
      console.log("dashboard user details from store ", state.chats);
   return {
     userDetail: state.chats.userDetail
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
