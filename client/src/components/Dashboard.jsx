import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Chatty from './chat/ChatContainer.jsx';
import Search from './search/Search.jsx';
import ListExampleMessages from "./chat/ListExampleMessages.jsx";
import FbPlugin from './fb/FbPlugin.jsx';
import Paper from "material-ui/Paper";
import TabsControl from './Mobile/TabsControl.jsx';
import FriendsList from './friends/FriendsList.jsx';

class Dashboard extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {};  
  }

render(){
    return( isDesktop?(<div className="dashboard">
      <Paper className="name-list-item" style={{flex:1, height:"100%", width:500, overflowY:"scroll" }}>
          <ListExampleMessages/>
      </Paper>
      <Paper style={{flex:1,height:"100%", width:500}}>
          <Chatty/>
      </Paper>
      <FbPlugin/>  
      <FriendsList/>
    </div>):(
      <div className="dashboard">
        <TabsControl/>
        <FbPlugin/>  
      </div>   
    ))
  
}
}
// Dashboard.propTypes = {
//   userData: PropTypes.string.isRequired
// };

export default Dashboard;
