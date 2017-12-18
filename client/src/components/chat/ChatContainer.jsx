import MessageList from './messageList.jsx';
import MessageForm from './messageForm.jsx';
import React from 'react';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import Auth from '../../modules/Auth';


class Chatty extends React.Component {

   constructor(props) {
    super(props);
    this.state = { messages:[], text: ''};
  }

   componentWillMount(){
       console.log("component will mount");
            
   
   } 

   componentDidMount(){
console.log("did mount")
            socket.on('connect', function () {
                console.log("socket connnected");
                socket.emit('authenticate', {token: Auth.getToken()});
            });
            socket.on('authenticated', function () {
                 socket.emit("user-connected", "user connected");
                 socket.on(this.props.userDetail.email, function(data){
                   console.log("********** ", data );
                 });
                 socket.on("message",  function(data){
               console.log("from server: "+data);
                        }.bind(this));
            });

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
              // this.props.actions.addMessage(message.text);
    console.log("emitting socket message: ", {message:message,activeThread:this.props.activeThread});
       if(this.props.activeThread.convo_id){
             socket.emit('send-message', {convo_id:this.props.activeThread.convo_id, message:{
                    sender_id: this.props.userDetail.email,
                    receiver_id: this.props.activeThread.email,
                    text: message.text
             }});
             this.props.actions.addMessage({convo_id:this.props.activeThread.convo_id, message:{
                    sender_id: this.props.userDetail.email,
                    receiver_id: this.props.activeThread.email,
                    text: message.text
             }});
       }else{
            socket.emit('send-message', {convo_id:"", message:{
                    sender_id: this.props.userDetail.email,
                    receiver_id: this.props.activeThread.email,
                    text: message.text
             }},function(data){
                    this.props.actions.pushNewThread({
                    convo_id:data.convo_id,
                    messages:[
                        {   sender_id:   this.props.userDetail.email,
                            receiver_id: data.receiver_id,
                            text: message.text
                    }
                    ]
                    
                });
            }.bind(this));
       }
     
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
     messages: state.myStore.message,
     activeThread: state.myStore.activeThread,
     userDetail: state.myStore.userDetail
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