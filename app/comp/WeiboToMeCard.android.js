import React, { Component } from 'react';
import { Text } from 'react-native';

export default class WeiboToMeCard extends Component {


    formatTime(time) {
        let times = time.split(' ');
        if (times.length >= 6) {
            let nt = '';
            nt += times[3] + '  ';
            nt += times[1] + ' ' + times[2] + ' ' + times[5];
            return nt;
        } else {
            return time;
        }
    }

    render() {
        return <Text>{this.props.data.text}</Text>;
    }
}
