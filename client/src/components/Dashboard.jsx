import React from 'react';
import Card, { CardHeader, CardContent }  from 'material-ui/Card';
import Chatty from './chat/ChatContainer.jsx';
import Search from './search/Search.jsx';
import ListExampleMessages from "./chat/SampleList.jsx";
// import FbPlugin from './fb/fbPlugin.jsx';

class Dashboard extends React.Component{
 constructor(props) {
    super(props);

    this.state = {};  
  }

  render(){
    return(<Card className="container">
        {/* <FbPlugin/> */}

        {/*{userData && <CardText style={{ fontSize: '16px', color: 'green' }}>{userData.userDetail.email}</CardText>}*/}

        {/*<Chatty/>*/}
        <Search/>  
        <ListExampleMessages/>
      </Card>
    )
  }
  
};

// Dashboard.propTypes = {
//   userData: PropTypes.string.isRequired
// };

export default Dashboard;
