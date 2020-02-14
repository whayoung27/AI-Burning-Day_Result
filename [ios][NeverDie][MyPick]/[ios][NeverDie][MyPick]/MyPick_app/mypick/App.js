import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import mainpage from './Main';
import showgrouplistpage from './ShowGroupList';
import showVideo from './ShowVideo'

const App = createStackNavigator(
  {
    Main: { screen: mainpage },

    ShowGroupList: { screen: showgrouplistpage },

    ShowVideo: {screen: showVideo},
  },

  { initialRouteName: 'Main', headerMode: 'none' }
);

export default createAppContainer(App);
