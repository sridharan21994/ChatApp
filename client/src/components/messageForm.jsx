class MessageForm extends React.Component{
 getInitialState(){
        return {text: ''};
    }
    changeHandler(e){
        this.setState({ text : e.target.value });
    }
    handleSubmit(e){
        e.preventDefault();
        var message = {
            text : this.state.text
        }
        this.props.submitfnc(message);
        this.setState({ text: '' });
    }
    render(){
        return(
          <div className="messageForm">
              <form onSubmit={this.handleSubmit} >
                  <input onChange={this.changeHandler} value={this.state.text}/>
              </form>
          </div>
        );
    }
}
