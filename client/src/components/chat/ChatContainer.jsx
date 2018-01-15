import MessageList from './messageList.jsx';
import MessageForm from './messageForm.jsx';
import React from 'react';
import {List, ListItem} from 'material-ui/List';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import Auth from '../../modules/Auth';
import io from 'socket.io-client';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

var socket;

class Chatty extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            tempStorage: [],
            thread:{},
            clicked: false
        };
        this.handleMessageSubmit=this.handleMessageSubmit.bind(this);
        this.findThread=this.findThread.bind(this);
    }

    componentWillMount() {
        console.log("component will mount");   
          
    }
    componentWillUnmount(){
        socket.close();
    }
    componentDidMount() {
        console.log("did mount");
        socket = io("http://localhost:3000", {transports: ['websocket'], upgrade: false,
        'query': {'token': localStorage.getItem("token")}
        }); 
         
    socket.on('connect', function () {
            console.log("socket connnected ", socket.id);
            socket.emit("user-connected", this.props.userDetail);

            socket.on("message-received",function(data){
                if((data.sender_name)&&(data.sender_name==="ANONYMOUS")){
                    console.log("from sever: new chat: ",data)
                    this.props.actions.pushNewThread({convo_id:data.convo_id, message:data.message});
                    this.props.actions.addContactList({convo_id:data.convo_id, name: "ANONYMOUS", email: "ANONYMOUS"});
                }else{
                    this.props.actions.addMessage(data);
                }
                // console.log("from other user: ",data);
                // if(this.props.threadList.find((content)=>content.convo_id===data.convo_id)){
                
                // }else{
                //     this.props.actions.pushNewThread(data);
                // }

                
            }.bind(this));
            socket.emit('authenticate', { token: Auth.getToken() });
    }.bind(this));


        socket.on('authenticated', function () {
            console.log("running socket authentication");
            // socket.on("message", function (data) {
            //     console.log("from server: " + data);
            // }.bind(this));
        });

        socket.on("disconnect",function(){
            socket.close();
        });

        socket.on("connect_failed", function(){
           socket.close();
        });

        socket.on("connect_error", function(){
           socket.close();
        });

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.activeThread.clicked!==this.state.clicked){
            this.setState({
                clicked: nextProps.activeThread.clicked
            })
        }
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

    handleMessageSubmit(message) {
        //         this.setState(prevState => ({
        //   messages: [...prevState.messages, message]
        //              }));
        // this.props.actions.addMessage(message.text);
        message.text=message.text.trim();
        if(this.props.activeThread.email&&message.text){
            let packet={};
            if(this.props.activeThread.email==="ANONYMOUS"){
                packet={
                    sender_id: this.props.userDetail.email,
                    text: message.text
                };
            }else{
                packet = {
                    receiver_id: this.props.activeThread.email,
                    text: message.text
                };
            }
          
        if (this.props.activeThread.convo_id) {
            console.log("emitting OLD socket message: ", {convo_id: this.props.activeThread.convo_id, message: packet});
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
                this.setState(prevState=>({
                    tempStorage: [...prevState.tempStorage, { convo_id: "", message: packet }]
                }));
                packet.sender_name=this.props.userDetail.name;
                packet.receiver_name=this.props.activeThread.name;
                console.log("emitting NEW socket message: ", {convo_id: this.props.activeThread.convo_id, message: packet});
                socket.emit('send-message', {
                    convo_id: "", message: packet
                }, function (data) {

                    console.log("from server:", data);
                    this.props.actions.updateActiveThread({email:this.props.activeThread.email,convo_id:data.convo_id});
                    this.props.actions.updateContactConvoId({email:this.props.activeThread.email,convo_id:data.convo_id});
                    var resultObject = this.search(data.receiver_id, this.state.tempStorage, false);
                    resultObject[0].convo_id = data.convo_id;
                    console.log("resultObject: ", resultObject);

                    if (resultObject[0].message.length > 1) {
                        socket.emit("send-message", resultObject[0].message.slice().splice(1, 2), function (data) {
                            this.props.actions.pushNewThread({convo_id:resultObject[0].convo_id,message:[resultObject[0].message]});
                        })
                    } else {
                        this.props.actions.pushNewThread({convo_id:resultObject[0].convo_id,message:[resultObject[0].message]});
                    }

                }.bind(this));

            }

        }}

    }
    findThread(activeThread,threadList){
        for(var i=0; i< threadList.length;i++){
            if(threadList[i].convo_id===activeThread.convo_id){
                return threadList[i];
            }
        }
        return "";
    }
    
    arrowBack(){
        this.props.actions.updateActiveThread({clicked:false});
    }

    render() {

        return (
            isDesktop?(<div className="chatty">
                    <MessageList thread={this.findThread(this.props.activeThread,this.props.threadList)} />
                    <MessageForm className="input-form" submitfnc={this.handleMessageSubmit} />
                </div>
                ):(<div className={this.state.clicked?"chatty-sm":"hide"}>
                    <div className="chatty-sm-header">
                        <ArrowBack className="arrow-back-sm" onClick={this.arrowBack.bind(this)}/>
                        {this.props.activeThread.name}
                    </div>
                    <MessageList thread={this.findThread(this.props.activeThread,this.props.threadList)} />
                    <MessageForm className="input-form" submitfnc={this.handleMessageSubmit} />
                </div>
                )           
        );
    }
}


function mapStateToProps(state, ownProps) {
    console.log("chatty from store: ", state.myStore);
        return {
            activeThread: state.myStore.activeThread,
            userDetail: state.myStore.userDetail,
            threadList: state.myStore.threadList
        }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Chatty);