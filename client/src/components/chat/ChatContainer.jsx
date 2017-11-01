import MessageList from './messageList.jsx';
import MessageForm from './messageForm.jsx';
import React from 'react';
// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:3000');

class Chatty extends React.Component {

   constructor(props) {
    super(props);
    this.state = { messages:[], text: ''};
  }

   componentDidMount(){
       console.log("component did mount");
      
       socket.emit("user-connected", localStorage.getItem("email_id")+" connected");
      
      socket.on("message",  function(data){
               console.log("from server: "+data.text);
              this.setState((prevState) => ({
             messages: [...prevState.messages, data]
             }));
          }.bind(this));
           
   } 
        
    
    messageRecieve(message){
        this.setState(prevState => ({
  messages: [...prevState.messages, message]
             }));
    }
    handleMessageSubmit(message){
        this.setState(prevState => ({
  messages: [...prevState.messages, message]
             }));
     console.log("emitting socket message: ", message);
        socket.emit('send-message', message);
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