import React from 'react';
import moment from 'moment-timezone';


class Message extends React.Component{
   constructor(props){
       super(props);
   }
scrollToBottom(){
  this.messagesEnd.scrollIntoView(false);
}

componentDidMount() {
  this.scrollToBottom();
}

componentDidUpdate() {
  this.scrollToBottom();
}
   render(){
        return(
            <li  
            className={((this.props.msg.sender_id===this.props.userDetail.email)||(this.props.msg.receiver_id===this.props.userDetail.email))?
            (this.props.msg.sender_id===this.props.userDetail.email)?"container-text":"container-text other-user"
            :(this.props.msg.receiver_id)?"container-text":"container-text other-user"
            }>
            <span>{this.props.msg.text}</span>
            <span style={{lineHeight:"12px",fontSize:12, display:"block", color:"rgba(0,0,0,0.66)"}}>{this.props.msg.time ? moment(this.props.msg.time).local().format("hh:mma, DD MMM") : ""}</span>
            <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
            </div>
            </li>
        );
    }
}

export default Message;