import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thumbnail, Text as TextBase } from 'native-base';

export default class WeiboComment extends Component {


   constructor(props) {
        super(props);
        console.log(this.props.comment);
    }

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
        let lc = (
            <View style={styles.cardStyle}>
                <View style={styles.cardHeadStyle}>
                    <Thumbnail size={35} source={{ uri: this.props.comment.user.profile_image_url }} />
                    <View style={{ marginLeft: 7, justifyContent: 'space-around' }}>
                        <Text style={{ fontSize: 13, color: '#eb984e' }}>{this.props.comment.user.name}</Text>
                        <Text style={{ fontSize: 11, color: '#b3b6b7' }}>{this.formatTime(this.props.comment.created_at)}</Text>
                    </View>
                </View>

                <View style={styles.cardBodyStyle}>
                    <TextBase>
                        {this.props.comment.text}
                    </TextBase>
                </View>
            </View>
        );
        return lc;
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        borderWidth: 1,
        borderColor: '#e5e8e8',
        backgroundColor: '#ffffff'
    },
    cardHeadStyle: {
        flexDirection: 'row',
        padding: 7,
    },
    cardBodyStyle: {
        paddingHorizontal: 10,
        paddingVertical: 7,
    }
});