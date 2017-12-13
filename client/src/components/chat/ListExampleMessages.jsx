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


const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="top-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const rightIconMenu = (
   <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

class ListExampleMessages extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {};  
  }
  
  openThread(e, contact){
     this.props.actions.updateActiveThread(contact.email)
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
                        rightIconButton={rightIconMenu}
                        primaryText={
                          <div style={{textAlign:"left"}}>
                          {contact.name}
                          </div>
                          }
                        secondaryText={
                          <p>
                            {contact.email} :I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                          </p>
                        }
                        secondaryTextLines={1}
                  />)
        }
return ( 
<div>
    <div>
      <List>
        <Subheader>LIST</Subheader>
        {this.props.contactList.map(renderList,this)}
        {/* <Divider inset={true} /> */}
      </List>
    </div> 
  </div>);
  }
}

function mapStateToProps(state, ownProps){
   return {
     contactList: state.myStore.contactList
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ListExampleMessages);