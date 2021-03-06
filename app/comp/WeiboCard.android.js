import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, CardItem, Thumbnail, Button, Text as TextBase, Icon } from 'native-base';
import WeiboImage from './WeiboImage';
import WeiboContent from './WeiboContent';

import {NEW_COMMENT} from './WeiboConstant';

export default class WeiboCard extends Component {

    //start the weibo content
    startWeiboContent(data) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                component: WeiboContent,
                params: {
                    data: data
                }
            })
        }
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

    getComments() {
        if (this.props.getComments) {
            this.props.getComments(NEW_COMMENT);
        }
    }

    render() {

        let lc = (
            <View style={styles.cardStyle}>
                <View style={styles.cardHeadStyle}>
                    <Thumbnail size={40} source={{ uri: this.props.weiData.user.profile_image_url }} />
                    <View style={{ marginLeft: 7, justifyContent: 'space-around' }}>
                        <Text style={{ fontSize: 13, color: '#eb984e' }}>{this.props.weiData.user.name}</Text>
                        <Text style={{ fontSize: 11, color: '#b3b6b7' }}>{this.formatTime(this.props.weiData.created_at)}</Text>
                    </View>
                </View>

                <View style={styles.cardBodyStyle} >
                    <TextBase onPress={() => this.startWeiboContent(this.props.weiData)}>
                        {this.props.weiData.text}
                    </TextBase>
                    <WeiboImage picUrls={this.props.weiData.pic_urls} />
                </View>

                <View style={styles.cardFootStyle}>
                    <View style={styles.commentButton} >
                        <Icon style={{ color: 'silver', fontSize: 20 }} name='ios-share-outline' />
                        <Text style={{ color: 'silver', marginLeft: 3 }}>{this.props.weiData.reposts_count}</Text>
                    </View>
                    <TouchableOpacity style={styles.commentButton} onPress={() => this.getComments()}>
                        <Icon style={{ color: 'silver', fontSize: 20 }} name='ios-chatboxes-outline' />
                        <Text style={{ color: 'silver', marginLeft: 3 }}>{this.props.weiData.comments_count}</Text>
                    </TouchableOpacity>
                    <View style={styles.favourButton} >
                        <Icon style={{ color: 'silver', fontSize: 20 }} name='ios-thumbs-up-outline' />
                        <Text style={{ color: 'silver', marginLeft: 3 }}>{this.props.weiData.attitudes_count}</Text>
                    </View>
                </View>
            </View>
        );
        return lc;
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        marginTop: 7,
        borderWidth: 1,
        borderColor: '#e5e8e8',
        borderRadius: 2,
        backgroundColor: '#ffffff'
    },
    cardHeadStyle: {
        flexDirection: 'row',
        padding: 7,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e8e8'
    },
    cardBodyStyle: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e8e8'
    },
    cardFootStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    commentButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 0.5,
        borderRightColor: '#e5e8e8'
    },
    favourButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});