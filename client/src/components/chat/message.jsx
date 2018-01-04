import React from 'react';


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
            </li>
        );
    }
}

export default Message;