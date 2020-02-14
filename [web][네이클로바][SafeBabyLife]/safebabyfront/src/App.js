import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
//import logo from './logo.svg';
import './App.css';

import MainPage from "./pages/MainPage"
import SecondPage from "./pages/SecondPage"

class App extends Component {
  

  render() {
    //if( this.props.commonStore.appLoaded){
    return (
      <div>
        <Switch>
          <Route path="/second" component={SecondPage} />
          <Route path="/" component={MainPage} />
        </Switch>
      </div>
    );
  }
  //return <Header />
}

export default App;
