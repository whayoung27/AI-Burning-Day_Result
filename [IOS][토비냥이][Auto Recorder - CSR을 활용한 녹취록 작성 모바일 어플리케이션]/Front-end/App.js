import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, StackActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import  HomeScreen  from './HomeScreen';
import  TrainingScreen  from './TrainingScreen';
import RecordScreen from './RecordScreen';
import  ResultScreen  from './ResultScreen';




const MainNavigator = createStackNavigator({
  HomeScreen: { screen: HomeScreen },
  TrainingScreen: {screen:TrainingScreen},
  RecordScreen: { screen: RecordScreen},
  ResultScreen : { screen: ResultScreen},
  //Profile: { screen: ProfileScreen },
});


const App = createAppContainer(MainNavigator);



export default App;