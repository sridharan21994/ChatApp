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
        this.state = {
            messages: [],
            text: '',
            tempStorage: []
        };
    }

    componentWillMount() {
        console.log("component will mount");
    }

    componentDidMount() {
        console.log("did mount")
        socket.on('connect', function () {
            console.log("socket connnected");
            socket.emit('authenticate', { token: Auth.getToken() });
        });
        socket.on('authenticated', function () {
            socket.emit("user-connected", "user connected");
            socket.on(this.props.userDetail.email, function (data) {
                console.log("********** ", data);
            });
            socket.on("message", function (data) {
                console.log("from server: " + data);
            }.bind(this));
        });

    }

    search(nameKey, myArray, stop) {
        var temp = [];
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].message.receiver_id === nameKey) {
                if (stop) return true;
                else temp.push(myArray[i]);
            }
        }
        if(temp.length===0) return false;
        else return temp;
    }
    messageRecieve(message) {
        //         this.setState(prevState => ({
        //   messages: [...prevState.messages, message]
        //              }));        
        //this.props.actions.addMessage(message);
    }

    handleMessageSubmit(message) {
        //         this.setState(prevState => ({
        //   messages: [...prevState.messages, message]
        //              }));
        // this.props.actions.addMessage(message.text);
        let packet = {
            sender_id: this.props.userDetail.email,
            receiver_id: this.props.activeThread.email,
            text: message.text
        };
        console.log("emitting socket message: ", { message: message, activeThread: this.props.activeThread });
        if (this.props.activeThread.convo_id) {
            socket.emit('send-message', {
                convo_id: this.props.activeThread.convo_id, message: packet
            });
            this.props.actions.addMessage({
                convo_id: this.props.activeThread.convo_id, message: packet
            });
        } else {

            if (this.search(this.props.activeThread.email, this.state.tempStorage, true)) {
                console.log("******true in tempStorage");
                this.state.tempStorage.map((content, index) => (content.message.receiver_id === this.props.activeThread.email) ?
                    this.setState(prevState=>({ tempStorage: [...prevState.tempStorage[index].message, packet] }))
                    : content);

            } else {
                  console.log("******not true in tempStorage");
                this.setState(prevState=>({
                    tempStorage: [...prevState.tempStorage, { convo_id: "", message: packet }]
                }));
                  console.log("tempStorage creating new", this.state.tempStorage);
                socket.emit('send-message', {
                    convo_id: "", message: packet
                }, function (data) {

                    console.log("from server:", data);
                    this.props.actions.updateActiveThread({email:this.props.activeThread.email,convo_id:data.convo_id});

                    var resultObject = this.search(data.receiver_id, this.state.tempStorage, false);
                    resultObject[0].convo_id = data.convo_id;
                    console.log("resultObject: ", resultObject);

                    if (resultObject[0].message.length > 1) {
                        socket.emit("send-message", resultObject[0].message.slice().splice(1, 2), function (data) {
                            this.props.actions.pushNewThread(resultObject[0]);
                        })
                    } else {
                        this.props.actions.pushNewThread(resultObject[0]);
                    }

                }.bind(this));

            }




        }

    }

    render() {
        return (
            <div className="chatty">
                <MessageList messages={this.props.messages} />
                <MessageForm submitfnc={this.handleMessageSubmit.bind(this)} />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    console.log("chatty from store: ", state.myStore);
    if (state.myStore.message) {
        return {
            messages: state.myStore.message,
            activeThread: state.myStore.activeThread,
            userDetail: state.myStore.userDetail,
            threadList: state.myStore.threadList
        }
    } else {
        return {
            messages: []
        }
    }

}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Chatty);