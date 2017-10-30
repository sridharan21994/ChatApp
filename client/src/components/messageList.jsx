
class MessageList extends React.Component {
render() {
        var renderMessage = function(message){
            return <Message msg={message.text} />
        }
        return(
        <ul className="message">
            { this.props.messages.map(renderMessage)}
        </ul>
        );
    }
}
