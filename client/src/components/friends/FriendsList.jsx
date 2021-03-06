import React from 'react';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';

class FriendsList extends React.Component {
constructor(props){
    super(props);
    this.state={
        refresh: false,
        open: false
    }
    this.listItemClicked = this.listItemClicked.bind(this);
}

componentWillReceiveProps(nextProps){
       if(nextProps.friendsList!==this.props.friendsList){
           this.setState({
               refresh: !this.state.refresh
           })
       }
}

listItemClicked(e, friend){
       console.log("***********list item " , friend );
       if(!this.props.contactList.find(list=>list.fb_id===friend.id)){
            this.props.actions.addContactList({fb_id: friend.id, name:friend.name, image:"https://graph.facebook.com/"+friend.id+"/picture", fb: true });
            this.props.actions.updateActiveThread({name: friend.name, email:"",fb_id: friend.id, clicked: false});
            this.props.actions.changeMobileTab({value: "a"});
       }else{
            this.setState({
                          open: true,
                        });
       }
     }
    handleRequestClose(){
    this.setState({
      open: false,
    });
  };

render() {
       var renderList = function(friend,i){
              return(
              <ListItem
                key={i}
                onMouseDown ={(e) => this.listItemClicked(e, friend)}
                primaryText={<span className="friends-name">{friend.name}</span>}
                leftAvatar={<Avatar alt={friend.name.charAt(0)+friend.name.charAt(friend.name.indexOf(" ")+1)} src={"https://graph.facebook.com/"+friend.id+"/picture"} />}
            />
        )
         
  }
        return(
            <div>
            <List className="fb-friends-list">
              {this.props.friendsList&&this.props.friendsList.map(renderList,this)}
            </List>
             <Snackbar
                open={this.state.open}
                message="Already added to your convo list"
                autoHideDuration={3000}
                onRequestClose={this.handleRequestClose.bind(this)}
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    console.log("dom", state.myStore)
        return {
            friendsList: state.myStore.friendsList,
            contactList: state.myStore.contactList
        }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);