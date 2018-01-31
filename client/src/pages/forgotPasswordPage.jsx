import React from 'react';
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class forgotPasswordPage extends React.Component{
   constructor(props){
       super(props);

       state={
           email: ""
       };
   }


submitForgotPassword(){

	    function forgotPasswordClicked(event) {
	        event.preventDefault();
            var data = "email=" + this.state.email;
            axios.post("/auth/forgot-password",
            {email:this.state
            .email})
            .then(response=>{
                if(response.status===200){
                    alert('sucessfully sent');
                }else{
                    alert('Error', status);
                }
            })
            .catch(err=>console.log(err));

	        // ajaxCall(data, "http://localhost:3000/auth/forgot-password", function(status, response) {
	        //     if (status == 200) {
	        //         alert('successfully sent');
	        //     } else {
	        //         alert('Error', status)
	        //     }
	        // });
	    

	    // function ajaxCall(data, url, callback) {
	    //     var xhttp = new XMLHttpRequest();
	    //     xhttp.open("POST", url, true);
	    //     xhttp.onreadystatechange = function() {
	    //         if (this.readyState == 4) {
	    //             return callback(this.status, JSON.parse(xhttp.response));
	    //         }
	    //     }
	    //     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    //     xhttp.send(data);
	    // }
   }
}

onChange(event){
    this.setState({
        email: event.target.value
    });
}

   render(){
       return(
                <form>
                    <label for="email"></label>
                    <input type="email" onChange={this.onChange.bind(this)}  name="email" required/>
                    <input type="submit" name="submit" action="/" onSubmit={this.submitForgotPassword.bind(this)} value="Send"/>
                </form>
       );
   }
}

export default forgotPasswordPage;