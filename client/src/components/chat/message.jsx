import React from 'react';

class Message extends React.Component{
   render(){
        return(
            <li className="message">{this.props.msg.sender_id}:{this.props.msg.text}
            </li>
        );
    }
}

export default Message;