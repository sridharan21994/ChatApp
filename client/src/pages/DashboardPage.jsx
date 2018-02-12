import React, { PropTypes } from 'react';
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
      data: '',
      loaded: false
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
            this.props.actions.initializeUser(response.data);
            this.setState({
              loaded:true
            })
            return true;
            }
        })
        .catch(error=>{  Auth.deauthenticateUser(); this.context.router.replace('/login'); throw(error);        });
  }

  /**
   * Render the component.
   */
  render() {
    return (<Dashboard/>);
  }

}

function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}

DashboardPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(null, mapDispatchToProps)(DashboardPage);
