import React from 'react';
import Message from "./message.jsx";
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";

class MessageList extends React.Component {
constructor(props){
    super(props);
}

shouldComponentUpdate(nextProps){
     return this.props.thread!==nextProps.thread;
}

render() {
        var renderMessage = function(message,i){
            return <Message key={i} msg={message} />
        }
        return(
        <ul className="message">
            {this.props.thread?this.props.thread.message.map(renderMessage):""}
        </ul>
        );
    }
}

function mapStateToProps(state, ownProps) {
        return {
            threadList: state.myStore.threadList
        }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessageList);