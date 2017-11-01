import React from 'react';

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

        //      console.log("emitting socket message: ", message);
        // socket.emit('send:message', message);
        this.setState({ text: '' });
    }
   
    render(){
        return(
          <div className="messageForm">
              <form onSubmit={this.handleSubmit.bind(this)} >
                  <input onChange={this.changeHandler.bind(this)} value={this.state.text}/>
                  <input type="button" onClick={this.handleSubmit.bind(this)} value="send message"/>
              </form>
          </div>
        );
    }
}

export default MessageForm;