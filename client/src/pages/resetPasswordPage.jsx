import React from 'react';
import axios from 'axios';
import { Card } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class resetPasswordPage extends React.Component{
   constructor(props){
       super(props);

       this.state={
           newPassword: "",
           verifyPassword: ""       
       };
       this.onChange = this.onChange.bind(this);
       this.submitResetPassword = this.submitResetPassword.bind(this);
   }


submitResetPassword(e){
           e.preventDefault();
          let token = document.location.href.split('token=')[1];
	      if(this.state.newPassword&&this.state.verifyPassword){
            axios.get("/auth/reset-password",
            {params:{token:token, newPassword:this.state.newPassword,verifyPassword:this.state.verifyPassword},headers:{'Content-type': 'application/x-www-form-urlencoded'}})
             .then(response=>{
                console.log("response")
                if(response.status===200){
                   this.setState({
                       success: "password is changed successfully!"
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

onChange(e){
    this.setState({
        success:"",
        error:""
    })
     if(e.target.name==="newPassword"){
          this.setState({
              newPassword: e.target.value
          })
     }else if(e.target.name==="verifyPassword"){
        this.setState({
            verifyPassword: e.target.value
        }) 
     }
}
   render(){
       return(
           <Card className="container">
                <form onSubmit={e=>this.submitResetPassword(e)}>
                    {this.state.success && <p className="success-message">{this.state.success}</p>}
                    {this.state.error && <p className="error-message">{this.state.error}</p>}
                    <div className="field-line">
                        <TextField
                        hintText="New Password"
                        floatingLabelFixed={true}
                        floatingLabelText="New Password"
                        name="newPassword"
                        onChange={e=>this.onChange(e)}
                        value={this.state.newPassword}
                        fullWidth={isDesktop?false:true}
                        />
                    </div>
                    <div className="field-line">
                        <TextField
                        hintText="Confirm New Password"
                        floatingLabelFixed={true}
                        floatingLabelText="Confirm New Password"
                        name="verifyPassword"
                        onChange={e=>this.onChange(e)}
                        value={this.state.verifyPassword}
                        fullWidth={isDesktop?false:true}
                        />
                    </div>
                    <div className="button-line">
                            <RaisedButton 
                            fullWidth={isDesktop?false:true}
                            type="submit" 
                            label="Reset Password" 
                            primary />
                    </div>
                </form>
            </Card>
       );
   }
}

export default resetPasswordPage;