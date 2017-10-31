import MessageList from './messageList.jsx';
import MessageForm from './messageForm.jsx';
import React from 'react';

class Chatty extends React.Component {

   constructor(props) {
    super(props);
    this.state = { messages:[], text: ''};
    socket.on("send:message",  this.messageRecieve);
  }

   
    messageRecieve(message){
        
        const temp=this.state.messages;
        temp.push(message);
        this.setState({
            messages: temp
        });
    }
    handleMessageSubmit(message){
        const temp=this.state.messages;
        temp.push(message);
        this.setState({
            messages: temp
        });
 
        socket.emit('send:message', message);
    }
    render(){
        return(
            <div className="chatty">
                <MessageList messages={this.state.messages}/>
                <MessageForm submitfnc={this.handleMessageSubmit.bind(this)}/>
            </div>
        );
    }
}

export default Chatty;