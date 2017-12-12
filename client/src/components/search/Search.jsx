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


    insideIconClicked(e,name){
      e.stopPropagation();
      console.log("**********inside icon ",  name );
    }

     listItemClicked(e, name){
       console.log("***********list item " , name );
     }

    blur(e){
       this.props.actions.addSuggestions([]);
    }


  render() {

        var renderList = function(list,i){
            return <ListItem key={i} 
            id="listId"
            primaryText={list.name}
            onMouseDown ={(e) => this.listItemClicked(e, list.email)}
            rightIcon={
              <div style={{margin:0,padding:12}} onMouseDown ={(e) => this.insideIconClicked(e, list.email)}>
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
          {this.props.list.map(renderList, this)}
      </List>

         {/*<SearchList list={this.props.list} />*/}
      </div>
    );
  }

}
function mapStateToProps(state, ownProps){
   return {
     list: state.chats.list
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
