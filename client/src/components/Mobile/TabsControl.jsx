import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import ListExampleMessages from "../chat/ListExampleMessages.jsx";
import Paper from "material-ui/Paper";
import Chatty from "../chat/ChatContainer.jsx";
import FriendsList from '../friends/FriendsList.jsx';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class TabsControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'a'
    };
  }

  handleChange(value){
    this.setState({
      value: value,
    });
  }

  render() {
    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      >
        <Tab label="Tab A" value="a">
          <div>
            <Paper>
             <ListExampleMessages/>
             <Chatty/>
            </Paper> 
          </div>
        </Tab>
        <Tab label="Tab B" value="b">
          <div>
            <FriendsList/>
          </div>
        </Tab>
      </Tabs>
    );
  }
}

export default TabsControl;