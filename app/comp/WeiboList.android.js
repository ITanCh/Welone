import React, { Component } from 'react';
import { ListView, View, Image, ToastAndroid } from 'react-native';
import { Button, Spinner, Icon, Card, CardItem, Thumbnail, Text } from 'native-base';

import WeiboCard from './WeiboCard'
import WeiboContent from './WeiboContent'
import WeiboModule from './module/WeiboModule'

const NOT_LOGIN = 0;
const IS_LOGIN = 1;
const ING_LOGIN = 2;

export const NEW_WEIBO = 0;
export const OLD_WEIBO = 1;

export default class WeiboList extends Component {

    constructor(props) {
        super(props);

        let ds1 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        let ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        var a = new WeiboContent('xiaxia', '../assets/12.jpg', '2017-1-1', 'nihao woshihahahah,nihao', '../assets/12.jpg', 123, 456);
        var b = new WeiboContent('dada', '../assets/12.jpg', '2017-1-1', 'nihao woshihahahah,nihao', '../assets/12.jpg', 123, 456);
        var c = new WeiboContent('lulu', '../assets/12.jpg', '2017-1-1', 'nihao woshihahahah,nihao', '../assets/12.jpg', 123, 456);

        this.state = {
            loveSource: ds1,
            meSource: ds2,
            login: ING_LOGIN,
            usrInfo: null,
            sinceID: 0,
            maxID: 0,
        };

        this.loveData = [];

        WeiboModule.isLogin((ok) => {
            if (ok) {
                //get user info
                this.getUserInfo();
            } else {
                this.setState({ login: NOT_LOGIN });
            }
        });
    }

    //The user want to login Weibo 
    onPressLogin() {
        this.setState({ login: ING_LOGIN });

        WeiboModule.login(
            (success) => {
                //get user info
                this.getUserInfo();
            },
            (err) => {
                this.setState({ login: NOT_LOGIN })
            }
        );
    }

    //User wants to logout
    onPressLogout() {
        this.setState({ login: ING_LOGIN });
        WeiboModule.logout(
            (ok) => {
                this.setState({ login: NOT_LOGIN });
            }
        );
    }

    //Get the profile of the user
    getUserInfo(type) {
        WeiboModule.getUserInfo(
            (success) => {
                if (success.length > 0) {
                    let ui = JSON.parse(success);
                    this.setState({ userInfo: ui, login: IS_LOGIN });
                } else {
                    this.setState({ login: NOT_LOGIN });
                    ToastAndroid.showWithGravity("user info is error", ToastAndroid.SHORT, ToastAndroid.CENTER, )
                }
            },
            (err) => {
                this.setState({ login: NOT_LOGIN });
                ToastAndroid.showWithGravity(err, ToastAndroid.SHORT, ToastAndroid.CENTER)
            }
        );
    }

    //Get the weibo of the user's friends
    getTimeLine(type) {
        let since = 0;
        let max = 0;

        if (type === NEW_WEIBO) {
            since = this.state.sinceID;
        } else {
            max = this.state.maxID;
        }

        WeiboModule.getTimeline(
            since,
            max,
            (success) => {
                if (success.length > 0) {
                    let tl = JSON.parse(success);
                    let statuses = tl.statuses;
                    if (statuses.length > 0) {
                        if (type === NEW_WEIBO) {
                            this.loveData = statuses.concat(this.loveData);
                            ToastAndroid.showWithGravity(`You have ${statuese.length} new weibo :)`, ToastAndroid.SHORT, ToastAndroid.CENTER);
                        } else {
                            this.loveData = this.loveData.concat(statuses);
                        }

                        let dl = this.loveData.length;
                        let nSince = this.loveData[0].id;
                        let nMax = this.loveData[dl - 1].id;

                        this.setState({
                            sinceID: nSince,
                            maxID: nMax,
                            loveSource: this.state.loveSource.cloneWithRows(this.loveData)
                        });
                    } else {
                        ToastAndroid.showWithGravity('Your friends are quiet :P', ToastAndroid.SHORT, ToastAndroid.CENTER);
                    }
                    console.log(success);
                } else {
                    ToastAndroid.showWithGravity('Your friends are disappeared :(', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
            },
            (err) => {
                ToastAndroid.showWithGravity(err, ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
        );
    }

    //Render
    render() {
        if (this.props.tab === 'Love') {
            //Time line
            return (
                <ListView
                    dataSource={this.state.loveSource}
                    renderRow={(rowData) => <WeiboCard weiData={rowData} />}
                    />
            );
        } else if (this.props.tab === 'Me') {
            //My info
            return (
                <ListView
                    dataSource={this.state.meSource}
                    renderRow={(rowData) => <WeiboCard weiData={rowData} />}
                    />
            );
        } else {
            //User Setting
            let content = null;
            if (this.state.login === NOT_LOGIN) {
                content = (
                    <View style={{
                        height: 200,
                        marginTop: 100,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{ width: 200, height: 100 }}>
                            <Button block primary onPress={() => this.onPressLogin()}>
                                <Icon name='md-log-in' />
                                Login Weibo
                            </Button>
                        </View>

                    </View>
                );
            } else if (this.state.login === ING_LOGIN) {
                content = (
                    <View style={{
                        height: 200,
                        marginTop: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Spinner color='blue' />
                    </View>
                );
            } else {
                content = (
                    <View style={{ flex: 1, alignItems: 'center', }}>
                        <Card style={{ alignSelf: 'stretch' }}>
                            <CardItem>
                                <View View style={{ flex: 1 }}>
                                    <View style={{ flex: 5, alignItems: 'center' }}>
                                        <Thumbnail size={70} source={{ uri: this.state.userInfo.avatar_large }} />
                                        <Text>{this.state.userInfo.name}</Text>
                                        <Text style={{ color: 'silver' }}>{this.state.userInfo.description}</Text>
                                    </View>
                                    <View style={{ marginTop: 30, borderTopWidth: 1, borderTopColor: '#f4f6f7', flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Button transparent textStyle={{ color: '#626567' }}>
                                            <Icon name="ios-heart-outline" style={{ color: '#f1948a' }} />
                                            <Text>{this.state.userInfo.friends_count}</Text>
                                        </Button>
                                        <Button transparent textStyle={{ color: '#626567' }}>
                                            <Icon name="ios-leaf-outline" style={{ color: '#82e0aa' }} />
                                            <Text>{this.state.userInfo.statuses_count}</Text>
                                        </Button>
                                        <Button transparent textStyle={{ color: '#626567' }}>
                                            <Icon name="ios-eye-outline" style={{ color: '#85c1e9' }} />
                                            <Text>{this.state.userInfo.followers_count}</Text>
                                        </Button>
                                    </View>
                                </View>
                            </CardItem>
                        </Card>
                        <View style={{ width: 100, marginTop: 10 }}>
                            <Button block danger onPress={() => this.onPressLogout()}>
                                <Icon name='md-log-out' />
                                Logout
                            </Button>
                        </View>
                    </View>
                );
            }
            return content;
        }
    }
}
