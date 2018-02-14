import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import ListExampleMessages from "../chat/ListExampleMessages.jsx";
import Paper from "material-ui/Paper";
import Chatty from "../chat/ChatContainer.jsx";
import FriendsList from '../friends/FriendsList.jsx';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";

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

  componentWillReceiveProps(nextProps){
    if(nextProps.mobileTab&&(nextProps.mobileTab!==this.state.value)){
      this.setState({
        value: nextProps.mobileTab
      })
    }
  }

  handleChange(value){

    this.props.actions.changeMobileTab({value: value});

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
        <Tab className="tab-control" label="Tab A" value="a">
          <div>
            <Paper>
             <ListExampleMessages/>
             <Chatty/>
            </Paper> 
          </div>
        </Tab>
        <Tab className="tab-control" label="Tab B" value="b">
          <div>
            <FriendsList/>
          </div>
        </Tab>
      </Tabs>
    );
  }
}

function mapStateToProps(state, ownProps) {
    return {
            mobileTab: state.myStore.mobileTab
        }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TabsControl);