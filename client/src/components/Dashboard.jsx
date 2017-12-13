import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Chatty from './chat/ChatContainer.jsx';
import Search from './search/Search.jsx';
import ListExampleMessages from "./chat/ListExampleMessages.jsx";
import ThreadList from "./chat/ThreadList.jsx";
// import FbPlugin from './fb/fbPlugin.jsx';

const Dashboard = ({ userData }) => (
  <Card className="container">
     {/* <FbPlugin/> */}

        {/*{userData && <CardText style={{ fontSize: '16px', color: 'green' }}>{userData.userDetail.email}</CardText>}*/}

        {/*<Chatty/>*/}
        <Search/>  
        <ListExampleMessages/>
        <ThreadList/>
      </Card>
    );

// Dashboard.propTypes = {
//   userData: PropTypes.string.isRequired
// };

export default Dashboard;
