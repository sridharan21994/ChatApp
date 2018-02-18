import React from 'react';
import {Facebook, FacebookApiException} from 'fb';
var fb = new Facebook();
import axios from "axios";
import Auth from '../../modules/Auth';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

// FB.options({version: 'v2.4'}); var fooApp = FB.extend({appId:
// '699842020201353', appSecret: 'e660c421be3ee1b4fe036286ce651fc3'});


class FbPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            open: false
        }
    }
     
    testAPI(access_token) {
        FB.api('/me', { access_token },function (response) {
            //console.log('Successful login for: ' + response.name, response);
        });
        FB.api('/me?fields=friends,picture,name', 'GET', {height: 99999}, function(response){
           // console.log("fb info list: ", response);
           var data= {friendsList: response.friends.data, id:response.id, name:response.name, picUrl:response.picture.data.url};
           this.props.actions.addFriendsList(data.friendsList);
           axios.post("/api/fb-info",data,{headers:{'Content-type': 'application/json','Authorization': `bearer ${Auth.getToken()}`}})
               .then(response=>{
                    console.log("saved fb info in server ");
               })
               .catch(err=>{console.log("err")});
        }.bind(this));
        // FB.api('/100001442496884?fields=picture', 'GET', {height: 99999}, function(response){
        //     console.log("photos: ", response);
        // });
    }

    // statusChangeCallback(response) {
    //     // The response object is returned with a status field that lets the app know
    //     // the current login status of the person. Full docs on the response object can
    //     // be found in the documentation for FB.getLoginStatus().
    //     if (response.status === 'connected') {
    //         // Logged into your app and Facebook.
    //         this.testAPI(response.authResponse.accessToken);
    //     } else {
    //         // The person is not logged into your app or we are unable to tell.
            
    //     }
    // }

    componentDidMount() {

        window.fbAsyncInit = function () {
            FB.init({appId: '205070456720997', cookie: true, xfbml: true, version: 'v2.4'});

            // FB.AppEvents.logPageView();

            FB.getLoginStatus(function (response) {
                if(response.status==="connected"){
                    this.testAPI(response.authResponse.accessToken);
                    console.log("fb access token: ", response)
                }else{
                    this.setState({open: true});
                }
            }.bind(this));

        }.bind(this);

        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs
                .parentNode
                .insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Now that we've initialized the JavaScript SDK, we call FB.getLoginStatus().
        // This function gets the state of the person visiting this page and can return
        // one of three states to the callback you provide.  They can be:
        //
        // 1. Logged into your app ('connected')
        // 2. Logged into Facebook, but not your app ('not_authorized')
        // 3. Not logged into Facebook and can't tell if they are logged into    your
        // app or not.
        //
        // These three cases are handled in the callback function.
        // FB.getLoginStatus(function(response) {   this.statusChangeCallback(response);
        // }.bind(this)); Load the SDK asynchronously

    }

    // Here we run a very simple test of the Graph API after login is successful.
    // See statusChangeCallback() for when this call is made. testAPI() {
    // console.log('Welcome!  Fetching your information.... ');   FB.api('/me',
    // function(response) {   console.log('Successful login for: ' + response.name);
    //   document.getElementById('status').innerHTML =     'Thanks for logging in, '
    // + response.name + '!';   }); } This is called with the results from from
    // FB.getLoginStatus(). statusChangeCallback(response) {
    // console.log('statusChangeCallback');   console.log(response);   // The
    // response object is returned with a status field that lets the   // app know
    // the current login status of the person.   // Full docs on the response object
    // can be found in the documentation   // for FB.getLoginStatus().   if
    // (response.status === 'connected') {     // Logged into your app and Facebook.
    //     this.testAPI();   } else if (response.status === 'not_authorized') {
    // // The person is logged into Facebook, but not your app.
    // document.getElementById('status').innerHTML = 'Please log ' +       'into
    // this app.';   } else {     // The person is not logged into Facebook, so
    // we're not sure if     // they are logged into this app or not.
    // document.getElementById('status').innerHTML = 'Please log ' +     'into
    // Facebook.';   } } This function is called when someone finishes with the
    // Login Button.  See the onlogin handler attached to it in the sample code
    // below. checkLoginState() {   FB.getLoginStatus(function(response) {
    // this.statusChangeCallback(response);   }).bind(this); }

    handleSubmit() {

        FB.login(function(response){
                if(response.status=== "connected"){
                   this.testAPI(response.authResponse.accessToken);
                   console.log(response);
                }
            }.bind(this),{scope: 'public_profile,email,user_friends,publish_actions'});
            this.setState({open: false});

    }

    handleClose(){
    this.setState({open: false});
  };

    render() {
        const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.handleClose.bind(this)}
      />,
      <RaisedButton
        label="Enter"
        primary={true}
        onClick={this.handleSubmit.bind(this)}
      />
    ];
        return (
            <div>
                {/* <a
                    href="javascript:void(0)"
                    onClick={this
                    .handleClick
                    .bind(this)}> FB Login</a> */}
                    <Dialog
                    title="Continue with Facebook"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    style={{zIndex: 99999}}
                    >
                    Click enter to chat with your facebook friends
                    </Dialog>
        
            </div>

        );
    }

}
function mapStateToProps(state, ownProps) {
        return {
            friendsList: state.myStore.friendsList
        }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FbPlugin);