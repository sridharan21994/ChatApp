import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import axios from "axios";
import Auth from '../../modules/Auth';
import moment from 'moment-timezone';


const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="top-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);


class ListExampleMessages extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {};  
    this.blockUser = this.blockUser.bind(this);
  }

    //   search(nameKey, myArray, stop) {
    //     var temp = [];
    //     for (var i = 0; i < myArray.length; i++) {
    //       console.log("myArray", myArray[i])
    //         if ((myArray[i].message[0].receiver_id === nameKey)||(myArray[i].message[0].sender_id === nameKey)) {
    //              return myArray[i].convo_id;
    //         }
    //     }
    //     return false;
    // }
  
  openThread(e, contact){
    //  var activeConvoId=this.search(contact.email, this.props.threadList);
    //  if(activeConvoId){
    //    this.props.actions.updateActiveThread({email:contact.email, convo_id: activeConvoId});
    //  }else{
       contact.clicked = true;
       this.props.actions.updateActiveThread(contact);
       this.props.actions.updateUnread({convo_id:contact.convo_id})
     //}
  }

  blockUser(e, contact){
    e.preventDefault();
    e.stopPropagation();
    console.log("block user: ", contact);
    // axios.get("/api/block", {params:{query:{convo_id:contact.convo_id, block: contact.email, blocked_by: this.props.userDetail.email}},
    // headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}})
    // .then(response=>{
    //         if ((response.status >= 200 && response.status <= 300) || response.status == 304) {
    //         console.log("axios after block: ", response);
    //         return true;
    //         }
    //     })
    //   .catch(error=>{throw(error);});
    this.props.actions.addBlockedList({"convo_id":contact.convo_id, "block": contact.email, "blocked_by": this.props.userDetail.email});

  }
 
  render(){
  
   var renderList = function(contact,i){
          
            return (<ListItem
                        key={i}
                        onClick={(e)=>this.openThread(e,contact)} 
                        leftAvatar={contact.image?
                          <Avatar alt={contact.name.charAt(0)+contact.name.charAt(contact.name.indexOf(" ")+1)} src={contact.image} />
                          :<Avatar>{contact.name.charAt(0)+contact.name.charAt(contact.name.indexOf(" ")+1)}</Avatar>
                          }
                        rightIconButton={<IconMenu iconButtonElement={iconButtonElement}>
                                          <MenuItem>Report</MenuItem>
                                          <MenuItem style={{zIndex: 9999}} onClick={(e)=>this.blockUser(e, contact)}>Block&Delete</MenuItem>
                                        </IconMenu>}
                        primaryText={
                          <div style={{textAlign: "left"}}>
                          <span style={{display:"inline-block", width:"240px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{contact.name}</span>
                          <span style={{fontSize:12, float:"right"}}>{contact.lastMessage&&contact.lastMessage.time? moment(contact.lastMessage.time).local().format("hh:mma, DD MMM"): ""}</span>                          
                          </div>
                          }
                        secondaryText={
                          <p style={{textAlign:"left", fontStyle: contact.lastMessage?"normal":"italic"}}>
                            <span style={{display:"inline-block", width:"300px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
                              {contact.lastMessage?contact.lastMessage.text:""}
                            </span>
                            <span className={((contact.unread&&contact.lastMessage.receiver_id&&(contact.lastMessage.receiver_id===this.props.userDetail.email))||
                              (contact.unread&&contact.lastMessage.sender_id&&(contact.lastMessage.sender_id!==this.props.userDetail.email)))
                              ?"new-icon":"hide"}>
                              &nbsp;new&nbsp;
                            </span>
                          </p>
                        }
                        secondaryTextLines={1}
                  />)
        }
return ( 
<div>
      <List>
        {/* <Subheader>LIST</Subheader> */}
        {this.props.contactList&&this.props.contactList.map(renderList,this)}
         {/* <Divider inset={true} />  */}
      </List>
  </div>);
  }
}

function mapStateToProps(state, ownProps){
   return {
     contactList: state.myStore.contactList,
     threadList: state.myStore.threadList,
     userDetail: state.myStore.userDetail
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ListExampleMessages);