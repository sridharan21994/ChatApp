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
       this.props.actions.updateUnread({convo_id:contact.convo_id});
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
           (contact.fb_id||contact.email==="ANONYMOUS") ? contact.image = "https://graph.facebook.com/"+contact.fb_id+"/picture":"";
            return (<ListItem
                        id="contactListItem"
                        key={i}
                        className={(isDesktop)&&((this.props.activeThread.convo_id&&(this.props.activeThread.convo_id===contact.convo_id))||((contact.email!=="ANONYMOUS")&&this.props.activeThread.email&&(this.props.activeThread.email===contact.email))||(this.props.activeThread.fb_id&&(this.props.activeThread.fb_id===contact.fb_id)))?"highlight":""}
                        onClick={(e)=>this.openThread(e,contact)} 
                        leftAvatar={contact.image?
                          <Avatar alt={contact.name.charAt(0)+contact.name.charAt(contact.name.indexOf(" ")+1)} src={contact.image} />
                          :<Avatar>{contact.name.charAt(0)+contact.name.charAt(contact.name.indexOf(" ")+1)}</Avatar>
                          }
                        rightIconButton={<IconMenu iconButtonElement={iconButtonElement}>
                                          <MenuItem>Report</MenuItem>
                                          <MenuItem style={{zIndex: 99}} onClick={(e)=>this.blockUser(e, contact)}>Block&Delete</MenuItem>
                                        </IconMenu>}
                        primaryText={
                          <div style={{textAlign:"left"}}>
                          <p style={{margin:0, maxWidth:"calc(100% - 40px)", width:"calc(100% - 40px)",display:"inline-block",textAlign: "left", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{contact.name}
                          </p>
                          <span className={((contact.unread&&contact.lastMessage.receiver_id&&(contact.lastMessage.receiver_id===this.props.userDetail.email))||
                              (contact.unread&&contact.lastMessage.sender_id&&(contact.lastMessage.sender_id!==this.props.userDetail.email)))
                              ?"new-icon":"hide"}>
                              &nbsp;new&nbsp;
                            </span>
                          
                          </div>
                          }
                        secondaryText={
                          <p style={{textAlign:"left", fontStyle: contact.lastMessage?"normal":"italic"}}>
                            <span>
                              {contact.lastMessage?contact.lastMessage.text:""}
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
        {this.props.contactList.length?
        this.props.contactList.map(renderList,this)
        :"You don't have any conversation to show... Please start a new conversation by adding your Facebook account..."}
         {/* <Divider inset={true} />  */}
      </List>
  </div>);
  }
}

function mapStateToProps(state, ownProps){
   return {
     contactList: state.myStore.contactList,
     activeThread: state.myStore.activeThread,
     userDetail: state.myStore.userDetail
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ListExampleMessages);