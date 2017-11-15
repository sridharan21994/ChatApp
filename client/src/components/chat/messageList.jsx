import React from 'react';
import Message from "./message.jsx";

class MessageList extends React.Component {
render() {
        var renderMessage = function(message,i){
            return <Message key={i} msg={message} />
        }
        return(
        <ul className="message">
            { this.props.messages.map(renderMessage)}
        </ul>
        );
    }
}

export default MessageList;