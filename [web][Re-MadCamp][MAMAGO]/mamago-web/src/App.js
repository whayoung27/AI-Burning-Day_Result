import React, { Component, useEffect, Suspense, useContext } from 'react';
import { Router, Route, Switch, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { createBrowserHistory } from 'history';
import * as R from 'ramda';
import { API_ADDR } from './common';

import LoginPage from './pages/LoginPage';
import IntroPage from './pages/IntroPage';
import TempChatting from './empty_pages/ChattingPage';
import ChattingPage from './pages/ChattingPage';
import LogsPage from './pages/LogsPage';
import UserChattingPage from './pages/UserChattingPage';
import UserLogsPage from './pages/UserLogsPage';


const history = createBrowserHistory();

const ScrollToTop = withRouter(({ children, location: { pathname } }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
});

const CookieAuthenticatedRoute = ({ component: Component, ...rest }) => {
  const cookie_access_token = Cookies.get('access_token');
  // if (R.isNil(cookie_access_token)) return <Login />;
  return <Route {...rest} component={Component} />;
};

const App = () => {
  return (
    <Router history={history}>
      <ScrollToTop>
        <Suspense fallback="loading">
          <Switch>
            <Route exact path="/tempchat" component={TempChatting}/>
            <Route exact path="/chat" component={ChattingPage} />
            <Route exact path="/me/chat" component={UserChattingPage} />
            <Route exact path="/logs" component={LogsPage} />
            <Route exact path="/me/logs" component={UserLogsPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/" component={IntroPage} />
          </Switch>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
