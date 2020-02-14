import React from 'react';
import { Route } from 'react-router-dom';
import Main from './pages/Main';
import Translate from './pages/Translate';
import AccountsDetail from './pages/AccountsDetail';
import AccountsMain from './pages/AccountsMain';

const App = () => {
  return (
    <>
      <Route exact path="/" component={Main} />
      <Route path="/Translate" component={Translate} />
      <Route path="/AccountsDetail" component={AccountsDetail} />
      <Route path="/AccountsMain" component={AccountsMain} />
    </>
  );
};

export default App;
