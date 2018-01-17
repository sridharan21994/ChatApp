import React from 'react';
import Auth from '../../modules/Auth';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import axios from "axios";
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import TextField from 'material-ui/TextField';
import Card from "material-ui/Card";

class Search extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };  
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentWillMount() {
    // axios.get("/api/dashboard",{headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}})
    //     .then(response=>{
    //         if ((response.status >= 200 && response.status <= 300) || response.status == 304) {
    //         console.log("axios: ", response, "this ", this);
    //         this.props.actions.initializeUser(response.data.user);
    //         return true;
    //         }
    //     })
    //     .catch(error=>{throw(error);});
  }
  
   changeHandler(e){
        this.setState({ text : e.target.value });
        if( e.target.value.length >= 3 ){
               axios.get("/api/search",{params:{query:e.target.value},headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}})
               .then(response=>{
                    this.props.actions.addSuggestions(response.data.result);
               })
            }
             
        
    }


    insideIconClicked(e,listItem){
      e.stopPropagation();
      console.log("**********inside icon ",  listItem );
    }

     listItemClicked(e, listItem){
       console.log("***********list item " , listItem );
       if(!this.props.contactList.find(list=>list.email===listItem.email)){
            this.props.actions.addContactList(listItem);
            this.props.actions.updateActiveThread({name: listItem.name, email:listItem.email, clicked: true});
       }
     }

    blur(e){
       this.props.actions.addSuggestions([]);
    }


  render() {

        var renderList = function(list,i){
            return <ListItem key={i} 
                id="listId"
                primaryText={list.name}
                onMouseDown ={(e) => this.listItemClicked(e, list)}
                rightIcon={
                <div style={{margin:0,padding:12}} onMouseDown ={(e) => this.insideIconClicked(e, list)}>
              <CommunicationChatBubble/>
              </div>}
              />
       }

    return (<div>
      <List>
          <TextField
           hintText="Search"
           onChange={this.changeHandler.bind(this)}
           onBlur={(e)=>this.blur(e)}
           value={this.state.text}
          />
          <Card zDepth={3}>
            {this.props.searchList.map(renderList, this)}
          </Card>
      </List>

         {/*<SearchList list={this.props.list} />*/}
      </div>
    );
  }

}
function mapStateToProps(state, ownProps){
   return {
     searchList: state.myStore.searchList,
     contactList: state.myStore.contactList
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
