import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Chatty from './chat/ChatContainer.jsx';
import Search from './search/Search.jsx';
import ListExampleMessages from "./chat/ListExampleMessages.jsx";
import ThreadList from "./chat/ThreadList.jsx";
import FbPlugin from './fb/fbPlugin.jsx';
import Paper from "material-ui/Paper";
import TabsControl from './Mobile/TabsControl.jsx';

const Dashboard = ({ userData }) => (
    window.outerWidth>768?(<div className="dashboard">
      <Paper style={{flex:1, height:500, width:500, overflow:"scroll" }}>
           {/* <FbPlugin/>  */}
          <ListExampleMessages/>
      </Paper>
      <Paper style={{flex:1,height:500, width:500}}>
          <Chatty style={{ position:'absolute', bottom:0 }} />
      </Paper>
      
    </div>):(
      <div>
        <TabsControl/>
      </div>   
    )
);

// Dashboard.propTypes = {
//   userData: PropTypes.string.isRequired
// };

export default Dashboard;
