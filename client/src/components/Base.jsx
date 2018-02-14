import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';
import LeftDrawer from './Mobile/LeftDrawer.jsx'
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import Search from './search/Search.jsx';
import Home from 'material-ui/svg-icons/action/home';

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

  toHomePage(){
    this.context.router.replace("/");
  }

  render(){
    return(
    isDesktop?(<div>
      {Auth.isUserAuthenticated() ? (
        <div className="top-bar">        
          <div className="top-bar-left">
            {/* <Home className="home-logo" onMouseDown={this.toHomePage.bind(this)} to="/"></Home> */}
            <div className="search">
              <Search/>              
            </div>
          </div>
          <div className="top-bar-right">
            <Link to="/logout">Log out</Link>
            {/* <Link to="/profile">Profile</Link> */}
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
      <div className="hide">
        footer
      </div>
  </div>):(<div className="mobile-view" onClick={this.closeMenu.bind(this)} >
     <div className="header">
     <MenuIcon style={{height: '50px', width: '50px', padding:"6px 10px 6px 6px"}} onClick={this.toggleMenu.bind(this)}/>
     {Auth.isUserAuthenticated()?(
      <div className="search">
         <Search/>
      </div>   
     ):(
       <p>
         Welcome to the App
       </p>
     )}
     </div>
      <LeftDrawer
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
Base.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Base;
