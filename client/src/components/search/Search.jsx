import React from 'react';
import Auth from '../../modules/Auth';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import axios from "axios";
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Card from "material-ui/Card";
import Snackbar from 'material-ui/Snackbar';

class Search extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      open: false
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


    // insideIconClicked(e,listItem){
    //   e.stopPropagation();
    //   console.log("**********inside icon ",  listItem );
    // }

     listItemClicked(e, listItem){
       console.log("***********list item " , listItem );
       if(!this.props.contactList.find(list=>list.email===listItem.email)){
            this.props.actions.addContactList(listItem);
            this.props.actions.updateActiveThread({name: listItem.name, email:listItem.email, fb_id:listItem.fb_id, clicked: false});
       }else{
         this.setState({
           open: true
         })
       }
     }

    blur(e){
       this.props.actions.addSuggestions([]);
    }
  handleRequestClose(){
    this.setState({
      open: false,
    });
  };

  render() {

        var renderList = function(list,i){
            // if(list.fb_details&&list.fb_details.name){
              
            //   list.name = list.fb_details.name;
            // }
            if(list.fb_details&&list.fb_details.id){
              list.fb_id = list.fb_details.id;
            }
            delete list.fb_details;
            return <ListItem key={i} 
                id="listId"
                leftAvatar={list.fb_id?
                          <Avatar alt={list.name.charAt(0)+list.name.charAt(list.name.indexOf(" ")+1)} src={"https://graph.facebook.com/"+list.fb_id+"/picture"} />
                          :<Avatar>{list.name.charAt(0)+list.name.charAt(list.name.indexOf(" ")+1)}</Avatar>
                          }                
                primaryText={list.name}
                onMouseDown ={(e) => this.listItemClicked(e, list)}
              />
       }

    return (<div>
      <List style={{padding:0}}>
          <TextField
           hintText="Search"
           onChange={this.changeHandler.bind(this)}
           onBlur={(e)=>this.blur(e)}
           value={this.state.text}
           fullWidth={isDesktop?false:true}
           underlineFocusStyle={{"border-bottom": "2px solid red"}}
          />
          <Card zDepth={3}>
            {this.props.searchList.map(renderList, this)}
          </Card>
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
