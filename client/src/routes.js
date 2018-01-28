import Base from './components/Base.jsx';
import HomePage from './components/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import Auth from './modules/Auth';


const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/profile',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ProfilePage);
        } else {
          callback(null, HomePage);
        }
      }
    },

    {
      path: '/login',
      getComponent: (location, callback,replace) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, LoginPage);
        }
      }  },

    {
      path: '/signup',
      getComponent: (location, callback,replace) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, SignUpPage);
        }
      }
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    },
    // {
    //   path:'/*',
    //   getComponent: (location, callback,replace) => {
    //     if (Auth.isUserAuthenticated()) {
    //       callback(null, DashboardPage);
    //     } else {
    //       callback(null, SignUpPage);
    //     }
    //   }
    // }

  ]
};

export default routes;
