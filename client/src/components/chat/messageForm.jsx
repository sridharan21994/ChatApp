import React from 'react';
import TextField from 'material-ui/TextField';

class MessageForm extends React.Component{


    constructor(props) {
    super(props);
    this.state = { text: ''};
  }


    changeHandler(e){
        this.setState({ text : e.target.value });
    }
    handleSubmit(e){
        e.preventDefault();
        var message = {
            text : this.state.text
        }
        this.props.submitfnc(message);

        //console.log("emitting socket message: ", message);
        //socket.emit('send-message', message);
        this.setState({ text: '' });
    }
   
    render(){
        return(
          <div className="message-form">
              <form onSubmit={this.handleSubmit.bind(this)} >
                  <input className="input-text" disabled={this.props.buffer} onChange={this.changeHandler.bind(this)} value={this.state.text}/> 
                  <input className="input-button" type="button" onClick={this.handleSubmit.bind(this)} value="send"/>
              </form>
          </div>
        );
    }
}

export default MessageForm;