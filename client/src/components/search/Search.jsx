import React from 'react';
import Auth from '../../modules/Auth';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import axios from "axios";
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import TextField from 'material-ui/TextField';

class Search extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      dataSource:[],
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
        console.log("typed ", e.target.value);
        if( e.target.value.length >= 3 ){
               axios.get("/api/search",{params:{query:e.target.value},headers:{'Content-type': 'application/x-www-form-urlencoded','Authorization': `bearer ${Auth.getToken()}`}})
               .then(response=>{
                    console.log("serach value ",response.data.result); 
                    this.props.actions.addSuggestions(response.data.result);
               })
            }   
        
    }

  render() {

        var renderList = function(list,i){
            return <ListItem key={i} 
            primaryText={list.name}
            rightIcon={<CommunicationChatBubble />}
            />
        }

    return (<div>
      <List >
          <TextField
           hintText="Search"
           onChange={this.changeHandler.bind(this)}
           value={this.state.text}
          />
          {this.props.list.map(renderList)}
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
