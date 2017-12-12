import MessageList from './messageList.jsx';
import MessageForm from './messageForm.jsx';
import React from 'react';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";



// import openSocket from 'socket.io-client';
// const socket = openSocket('http://localhost:3000');

class Chatty extends React.Component {

   constructor(props) {
    super(props);
    this.state = { messages:[], text: ''};
  }

   componentWillMount(){
       console.log("component did mount");
      
       socket.emit("user-connected", "user connected");
      
      socket.on("message",  function(data){
               console.log("from server: "+data.text);
//         this.setState(prevState => ({
//   messages: [...prevState.messages, message]
//              }));
               this.props.actions.addMessage(data.text);
          }.bind(this));
           
   } 
        
    
    messageRecieve(message){
//         this.setState(prevState => ({
//   messages: [...prevState.messages, message]
//              }));        
        this.props.actions.addMessage(message);
    }

    handleMessageSubmit(message){
//         this.setState(prevState => ({
//   messages: [...prevState.messages, message]
//              }));
               this.props.actions.addMessage(message.text);
     console.log("emitting socket message: ", message);
        socket.emit('send-message', message);
    }

    render(){
        return(
            <div className="chatty">
                <MessageList messages={this.props.messages}/>
                <MessageForm submitfnc={this.handleMessageSubmit.bind(this)}/>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps){
    console.log("chatty from store: ",state.myStore);
    if(state.myStore.message){
       return {
     messages: state.myStore.message
       }
    }else{
        return{
            messages: []
        }
    }
   
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Chatty);