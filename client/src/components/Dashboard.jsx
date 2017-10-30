import React, { PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Chatty from './ChatContainer.jsx';

const Dashboard = ({ userData }) => (
  <Card className="container">
    <CardTitle
      title="Dashboard"
      subtitle="You should get access to this page only after authentication."
    />

    {userData && <CardText style={{ fontSize: '16px', color: 'green' }}>{userData}</CardText>}

    <Chatty/>
    
  </Card>
);

// Dashboard.propTypes = {
//   userData: PropTypes.string.isRequired
// };

export default Dashboard;
