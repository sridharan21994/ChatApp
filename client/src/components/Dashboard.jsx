import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Chatty from './chat/ChatContainer.jsx';
// import FbPlugin from './fb/fbPlugin.jsx';

const Dashboard = ({ userData }) => (
  <Card className="container">
    <CardTitle
      title="Dashboard"
      subtitle="You should get access to this page only after authentication."
    />
    {/* <FbPlugin/> */}

    {userData && <CardText style={{ fontSize: '16px', color: 'green' }}>{userData.email}</CardText>}

    <Chatty/>
    
  </Card>
);

// Dashboard.propTypes = {
//   userData: PropTypes.string.isRequired
// };

export default Dashboard;
