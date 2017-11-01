import React from 'react';

class Message extends React.Component{
   render(){
        return(
            <li className="message">{this.props.msg}
            </li>
        );
    }
}

export default Message;