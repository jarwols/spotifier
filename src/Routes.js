import React from 'react';
import { Route, Router } from 'react-router-dom';
import Login from './components/Login.jsx'
import App from './components/App'
import history from './history';
import 'velocity-animate';
import 'velocity-animate/velocity.ui';

const Routes = () => (
  <Router history={history} component={Login}>
    <div id="router">
      <Route exact path="/" render={(props) => <Login {...props} />} />
      <Route path="/callback" render={(props) => <App {...props} />} />
    </div>
  </Router>
);

export default Routes;