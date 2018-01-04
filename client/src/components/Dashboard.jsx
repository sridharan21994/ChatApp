import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Chatty from './chat/ChatContainer.jsx';
import Search from './search/Search.jsx';
import ListExampleMessages from "./chat/ListExampleMessages.jsx";
import ThreadList from "./chat/ThreadList.jsx";
import FbPlugin from './fb/fbPlugin.jsx';

const Dashboard = ({ userData }) => (
  <div>
    <div style={{margin:"o auto", textAlign: "center"}}>
      <Search/>
    </div>  
    <div style={{display:'flex', margin:'0 auto', width: 1000, textAlign: 'center'}}>
      <Card style={{flex:1, height:500, width:500, overflow:"scroll" }}>
           <FbPlugin/> 
          <ListExampleMessages/>
      </Card>
      <Card style={{flex:1,height:500, width:500, overflow:"scroll"}}>
          <Chatty style={{ position:'absolute', bottom:0 }} />
      </Card>
      
    </div>
  </div>
);

// Dashboard.propTypes = {
//   userData: PropTypes.string.isRequired
// };

export default Dashboard;
