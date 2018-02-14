import React from 'react';
import axios from 'axios';
import { Card } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class forgotPasswordPage extends React.Component{
   constructor(props){
       super(props);

       this.state={
           email: ""
       };
       this.onChange = this.onChange.bind(this);
       this.submitForgotPassword = this.submitForgotPassword.bind(this);
   }


submitForgotPassword(e){
            e.preventDefault();
            var data = "email=" + this.state.email;
            console.log(this.state.email);
            if(this.state.email){
            axios.get("/auth/forgot-password",
            {params:{email:this.state.email},headers:{'Content-type': 'application/x-www-form-urlencoded'}})
            .then(response=>{
                console.log("response")
                if(response.status===200){
                   this.setState({
                       success: "Link to reset password was sent to your registered email address"
                   })
                }else{
                    this.setState({
                        error: response.message
                    })
                    alert('Error', status);
                }
            })
            .catch(err=>{console.log(err);
              this.setState({
                  error: err.name
              })  
          });
        }else{
            this.setState({
                error: "Field cannot be empty"
            })
        }

}

onChange(event){
    this.setState({
        email: event.target.value,
        success:"",
        error:""
    });
}

   render(){
       return(
           <Card className="container">
                <form onSubmit={e=>this.submitForgotPassword(e)}>
                          {this.state.success && <p className="success-message">{this.state.success}</p>}
                          {this.state.error && <p className="error-message">{this.state.error}</p>}
                        <div className="field-line">
                            <TextField
                            hintText="Email"
                            floatingLabelFixed={true}
                            floatingLabelText="Email"
                            name="email"
                            onChange={e=>this.onChange(e)}
                            value={this.state.email}
                            fullWidth={isDesktop?false:true}
                            />
                        </div>
                        <div className="button-line">
                            <RaisedButton
                             fullWidth={isDesktop?false:true}
                             type="submit" 
                             label="Submit" 
                             primary />
                        </div>
                </form>
           </Card>
       );
   }
}

export default forgotPasswordPage;