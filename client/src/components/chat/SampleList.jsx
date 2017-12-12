import React from 'react';
import List, {
  ListItem,
  ListSubheader,
} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/colors';
import IconButton from 'material-ui/IconButton';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import IconMenu from 'material-ui/IconMenu';
import Menu, {MenuItem} from 'material-ui/Menu';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import Icon from 'material-ui/Icon';


const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="top-left"
  >
    <Icon color={grey400} >MoreVertIcon</Icon>
  </IconButton>
);

const rightIconMenu = (
  <Icon iconButtonElement={iconButtonElement}>
     MenuItem
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </Icon>
);

class ListExampleMessages extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {};  
  }

  render(){
  
   var renderList = function(contact,i){
            return (<ListItem
                        key={i} 
                        leftAvatar={<Avatar src="images/ok-128.jpg" />}
                        rightIconButton={rightIconMenu}
                        primaryText={<div style={{textAlign:"left"}}>
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
      <List subheader={<ListSubheader>Settings</ListSubheader>}>
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