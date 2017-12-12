import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js';
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
// import {loadPage} from "./actions/actions.js";

const store = configureStore();
// store.dispatch(loadPage());

const theme=createMuiTheme({});

// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();

ReactDom.render((
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Router history={browserHistory} routes={routes} />
    </MuiThemeProvider>
  </Provider>
  ), document.getElementById('react-app'));
