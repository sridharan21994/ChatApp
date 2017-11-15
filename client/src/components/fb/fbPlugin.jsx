import React from 'react';
import FB from 'fb';
FB.options({version: 'v2.4'});
var fooApp = FB.extend({appId: '699842020201353', appSecret: 'e660c421be3ee1b4fe036286ce651fc3'});

class FbPlugin extends React.Component{
     constructor(props) {
    super(props);
  }

 componentDidMount() {
      window.fbAsyncInit = function() {
        FB.init({
          appId  : '699842020201353',
          status : true, // check login status
          cookie : true, // enable cookies to allow the server to access the session
          xfbml  : true  // parse XFBML
        });
      };

      (function() {
        var e = document.createElement('script');
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        e.async = true;
        document.getElementById('react-app').appendChild(e);
      }());
   
    // Now that we've initialized the JavaScript SDK, we call
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.
    // FB.getLoginStatus(function(response) {
    //   this.statusChangeCallback(response);
    // }.bind(this));

  // Load the SDK asynchronously
  
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
  console.log('Successful login for: ' + response.name);
  document.getElementById('status').innerHTML =
    'Thanks for logging in, ' + response.name + '!';
  });
}

// This is called with the results from from FB.getLoginStatus().
statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    this.testAPI();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
    'into Facebook.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
checkLoginState() {
  FB.getLoginStatus(function(response) {
    this.statusChangeCallback(response);
  }).bind(this);
}

handleClick() {
  FB.login(this.checkLoginState().bind(this));
}

render(){
    return(
        <div>
            <a href="#" onClick={this.handleClick.bind(this)}>Login</a>
            </div>

    );
}

}
export default FbPlugin;