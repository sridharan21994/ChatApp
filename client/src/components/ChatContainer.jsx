import MessageList from './MessageList.jsx';
import MessageForm from './MessageForm.jsx';


class Chatty extends React.Component {


    getInitialState(){
        socket.on('send:message', this.messageRecieve); 

        return { messages:[], text: ''};
    }
    messageRecieve(message){
        this.state.messages.push(message);
        this.setState();
    }
    handleMessageSubmit(message){
        this.state.messages.push(message);
        this.setState();
 
        socket.emit('send:message', message);
    }
    render(){
        return(
            <div className="chatty">
                <Title text="Chat"/>
                <MessageList messages={this.state.messages}/>
                <MessageForm submitfnc={this.handleMessageSubmit}/>
            </div>
        );
    }
}