import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thumbnail, Text as TextBase } from 'native-base';

export default class WeiboComment extends Component {

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
                    <View style={{ flex: 1 }}>
                        <Thumbnail size={30} source={{ uri: this.props.comment.user.profile_image_url }} />
                    </View>
                    <View style={{ flex: 7, justifyContent: 'space-around' }}>
                        <Text style={{ fontSize: 13, color: '#eb984e' }}>{this.props.comment.user.name}</Text>
                        <Text style={{ fontSize: 11, color: '#b3b6b7' }}>{this.formatTime(this.props.comment.created_at)}</Text>
                    </View>
                </View>

                <View style={styles.cardBodyStyle}>
                    <View style={{ flex: 1 }}>
                    </View>
                    <View style={{ flex: 7 }}>
                        <TextBase>
                            {this.props.comment.text}
                        </TextBase>
                    </View>
                </View>
            </View>
        );
        return lc;
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        marginHorizontal: 7,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e8e8'
    },
    cardHeadStyle: {
        marginTop: 5,
        flexDirection: 'row',
    },
    cardBodyStyle: {
        flexDirection: 'row',
        marginBottom: 7,
    }
});