/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator
} from 'react-native';

import MainTab from './app/comp/MainTab';

export default class welone extends Component {
  render() {

    let mainComponent = MainTab;
    return (
      <Navigator
        initialRoute={{ component: mainComponent }}
        configureScene={(route) => {
          return Navigator.SceneConfigs.VerticalDownSwipeJump;
        }}
        renderScene={(route, navigator) => {
          let Comp = route.component;
          return <Comp {...route.params} navigator={navigator} />
        }}
      />
    );
  }
}

AppRegistry.registerComponent('welone', () => welone);
