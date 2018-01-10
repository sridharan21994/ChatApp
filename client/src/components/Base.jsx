import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';
import LeftDrawer from './Mobile/LeftDrawer.jsx'
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import Search from './search/Search.jsx';

var menus=[{text:"profile", icon: "", link:"/profile"},
            {text:"login", icon: "", link:"/login"},
            {text:"signup", icon: "", link:"/signup"},
            {text:"logout", icon: "", link:"/logout"}
];


class Base extends React.Component{
  constructor(props){
    super(props);
    this.state={
      navDrawerOpen: false
    }
  }
  
  toggleMenu(e){
    e.stopPropagation();
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  }
  closeMenu(e){
        e.stopPropagation();
    this.setState({
      navDrawerOpen: false
    })
  }

  render(){
    return(
  window.outerWidth>768?(<div>
      {Auth.isUserAuthenticated() ? (
        <div className="top-bar">        
          <div className="top-bar-left">
            <IndexLink className="logo" to="/">My App</IndexLink>
            <div className="search">
              <Search/>              
            </div>
          </div>
          <div className="top-bar-right">
            <Link to="/logout">Log out</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
      ) : (
      <div className="top-bar">
      <div className="top-bar-left">
        <IndexLink to="/">My App</IndexLink>
      </div>
        <div className="top-bar-right">
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </div>
        </div>
      )}


    { /* child component will be rendered here */ }
    {this.props.children}

  </div>):(<div onClick={this.closeMenu.bind(this)} >
     
     <MenuIcon style={{height: '32px', width: '32px'}} onClick={this.toggleMenu.bind(this)}/>
     {Auth.isUserAuthenticated()?(
      <div className="search">
         <Search/>
      </div>   
     ):(
       <p>
         Welcome to the App
       </p>
     )}
      <LeftDrawer
          style={{position: "relative", zIndex: "99"}}
          navDrawerOpen={this.state.navDrawerOpen}        
          menus={menus}
          username="User Admin"/>
          {this.props.children}
    </div>)
);
  }
}

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;
