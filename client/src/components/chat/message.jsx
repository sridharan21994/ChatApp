import React from 'react';
import moment from 'moment-timezone';


class Message extends React.Component{
   constructor(props){
       super(props);
   }

   render(){
        return(
            <li  
            className={((this.props.msg.sender_id===this.props.userDetail.email)||(this.props.msg.receiver_id===this.props.userDetail.email))?
            (this.props.msg.sender_id===this.props.userDetail.email)?"containerText":"containerText other-user"
            :(this.props.msg.receiver_id)?"containerText":"containerText other-user"
            }>
            {this.props.msg.text}
            {this.props.msg.time ? moment(this.props.msg.time).local().format("hh:mma, DD MMM") : ""}
            </li>
        );
    }
}

export default Message;