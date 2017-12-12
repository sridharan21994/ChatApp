import React, { PropTypes } from 'react';
import Profile from '../components/Profile.jsx';
import Auth from '../modules/Auth';
import { connect } from "react-redux";
import * as actions from "../actions/actions.js";
import { bindActionCreators } from "redux";
class ProfilePage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        name: '',
        newpassword: '',
        confirmnewpassword: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    if((this.state.user.newpassword===this.state.user.confirmnewpassword)&&(this.state.user.newpassword.trim().length>7)&&(this.state.user.confirmnewpassword.trim().length>7)){
       // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const newpassword = encodeURIComponent(this.state.user.newpassword);
    const formData = `name=${name}&newpassword=${newpassword}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/editprofile');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // set a message
        console.log('successMessage: ', xhr.response.message);

        // make a redirect
        if(xhr.response.success){
            console.log(xhr.response)
        this.props.actions.initializeUser(xhr.response.user);
        this.context.router.replace('/');
        }
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
    }else {
        const errors = this.state.errors;
        if(this.state.user.newpassword!==this.state.user.confirmnewpassword){
            errors["summary"] = "passwords are not equal";
        }else{
             errors["summary"] = "Password must be greater than 8 characters";
        }     
        this.setState({
          errors
        });
    }
    
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user,
      errors:{}
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <Profile
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
        userDetail={this.props.userDetail}
      />
    );
  }

}

ProfilePage.contextTypes = {
  router: PropTypes.object.isRequired
};


function mapStateToProps(state, ownProps){
   return {
     userDetail: state.myStore.userDetail
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);