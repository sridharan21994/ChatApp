import React from 'react';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

class FriendsList extends React.Component {
constructor(props){
    super(props);
    this.state={
        refresh: false
    }
}

componentWillReceiveProps(nextProps){
       if(nextProps.friendsList!==this.props.friendsList){
           this.setState({
               refresh: !this.state.refresh
           })
       }
}

render() {
       var renderList = function(friend,i){
              return(
              <ListItem
                key={i}
                primaryText={friend.name}
                leftAvatar={<Avatar alt={friend.name.charAt(0)+friend.name.charAt(friend.name.indexOf(" ")+1)} src={"https://graph.facebook.com/"+friend.id+"/picture"} />}
                rightIcon={<CommunicationChatBubble />}
            />
        )
         
  }
        return(
            <List className="fb-friends-list">
              {this.props.friendsList&&this.props.friendsList.map(renderList,this)}
            </List>
        );
    }
}

function mapStateToProps(state, ownProps) {
    console.log("dom", state.myStore)
        return {
            friendsList: state.myStore.friendsList
        }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);