import React from 'react';
import { connect } from "react-redux";
import * as actions from "../../actions/actions.js";
import { bindActionCreators } from "redux";
import { Card } from 'material-ui/Card';


class ThreadList extends React.Component {

   constructor(props) {
    super(props);
    this.state = {};
  }
  
  render(){
      var renderThread= function(that, activeThread){
           var thread = that.props.threadList.find(thread=>thread.convo_id===activeThread);
           return(
               <Card className="container">
                   sdfgsdf sdfs dfs dfs f
               </Card>
           )
      }
      return(
          <div>
          {renderThread(this, this.props.activeThread)}
          </div>
      );
  }
  
}

function mapStateToProps(state, ownProps){
   return {
     threadList: state.myStore.threadList,
     activeThread: state.myStore.activeThread
   }
}
function mapDispatchToProps(dispatch){
  return{
     actions: bindActionCreators( actions , dispatch )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ThreadList);