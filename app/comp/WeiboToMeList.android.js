import React, { Component } from 'react';
import { ListView, View, ToastAndroid } from 'react-native';
import { Button } from 'native-base';

import WeiboModule from './module/WeiboModule';
import WeiboToMeCard from './WeiboToMeCard';

import { NEW_TOME, OLD_TOME } from './WeiboConstant';


export default class WeiboToMeList extends Component {

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            meSource: ds,
            meData: [],
            maxToMe: 0,
            sinceToMe: 0,
            maxMention: 0,
            sinceMention: 0
        };

    }

    //get the messages sent to me
    getMessages(type) {

        let since = 0;
        let max = 0;

        if (type === NEW_TOME) {
            since = this.state.sinceToMe;
        } else {
            max = this.state.maxToMe;
        }

        WeiboModule.getToMe(
            since.toString(),
            max.toString(),
            (success) => {
                if (success.length > 0) {
                    let messages = JSON.parse(success);
                    //console.log(messages);
                    let { comments } = messages;

                    if (comments && comments.length > 0) {
                        if (type === NEW_TOME) {
                            comments = comments.concat(this.state.meData);
                            this.setState({ meData: comments, sinceToMe: comments[0].id }, this.getMentions(type));
                        } else {
                            comments = this.state.meData.concat(comments);
                            this.setState({ meData: comments, maxToMe: comments[comments.length - 1].id - 1 }, this.getMentions(type));
                        }
                    } else {
                        ToastAndroid.showWithGravity('没人理你 zZ', ToastAndroid.SHORT, ToastAndroid.CENTER);
                    }
                } else {
                    ToastAndroid.showWithGravity('无言以对 :(', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
            },
            (err) => {
                ToastAndroid.showWithGravity(err, ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        );
    }

    getMentions(type) {
        let since = 0;
        let max = 0;

        if (type === NEW_TOME) {
            since = this.state.sinceMention;
        } else {
            max = this.state.maxMention;
        }

        WeiboModule.getMentions(
            since.toString(),
            max.toString(),
            (success) => {
                if (success.length > 0) {
                    let messages = JSON.parse(success);
                    let { comments } = messages;

                    if (comments && comments.length > 0) {
                        if (type === NEW_TOME) {
                            comments = comments.concat(this.state.meData);
                            this.setState({ meData: comments, sinceMention: comments[0].id });
                        } else {
                            comments = this.state.meData.concat(comments);
                            this.setState({ meData: comments, maxMention: comments[comments.length - 1].id - 1 });
                        }
                        this.updateData();
                    } else {
                        ToastAndroid.showWithGravity('没人理你 zZ', ToastAndroid.SHORT, ToastAndroid.CENTER);
                    }
                } else {
                    ToastAndroid.showWithGravity('无言以对 :(', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
            },
            (err) => {
                ToastAndroid.showWithGravity(err, ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        );
    }

    updateData() {
        console.log(this.state.meData);
        this.setState({ meSource: this.state.meSource.cloneWithRows(this.state.meData) });
    }

    //The footer of the listview 
    getEnd(type) {
        return (
            <View style={{ alignItems: 'center' }} >
                <View style={{ marginVertical: 7 }}>
                    <Button bordered info small onPress={() => this.getMessages(OLD_TOME)}> 更多 </Button>
                </View>
            </View>
        );
    }

    //Render
    render() {
        //My info
        return (
            <ListView
                dataSource={this.state.meSource}
                renderRow={(rowData) => <WeiboToMeCard data={rowData} />}
                renderFooter={() => this.getEnd()}
            />
        );
    }
}


