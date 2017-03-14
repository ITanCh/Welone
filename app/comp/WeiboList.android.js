import React, { Component } from 'react';
import { ListView, View, Image, ToastAndroid, StyleSheet } from 'react-native';
import { Button, Spinner, Icon, Card, CardItem, Thumbnail, Text } from 'native-base';

import WeiboCard from './WeiboCard'
import WeiboModule from './module/WeiboModule'
import { NEW_WEIBO, OLD_WEIBO, TAB_LOVE, TAB_ME, TAB_SET } from './WeiboConstant';

const NOT_LOGIN = 0;
const IS_LOGIN = 1;
const ING_LOGIN = 2;

const GET_HEADER = 0;
const GET_FOOTER = 1;

export default class WeiboList extends Component {

    constructor(props) {
        super(props);

        let ds1 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        let ds2 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            loveSource: ds1,
            meSource: ds2,
            login: ING_LOGIN,
            usrInfo: null,
            lineGetting: false
        };

        this.loveData = [];
        this.sinceID = 0;
        this.maxID = 0;
        this.gettingTimeLine = false;

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
    getUserInfo() {
        WeiboModule.getUserInfo(
            (success) => {
                if (success.length > 0) {
                    let ui = JSON.parse(success);
                    this.setState({ userInfo: ui, login: IS_LOGIN });
                } else {
                    this.setState({ login: NOT_LOGIN });
                    ToastAndroid.showWithGravity("用户信息错误！", ToastAndroid.SHORT, ToastAndroid.CENTER, )
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

        //if the last request has not been reponsed, do nothing
        if (this.gettingTimeLine) {
            return;
        }
        this.gettingTimeLine = true;

        let since = 0;
        let max = 0;

        if (type === NEW_WEIBO) {
            since = this.sinceID;
        } else {
            max = this.maxID;
        }

        WeiboModule.getTimeline(
            since.toString(),
            max.toString(),
            (success) => {
                if (success.length > 0) {
                    let tl = JSON.parse(success);
                    let statuses = tl.statuses;
                    if (statuses.length > 0) {
                        if (type === NEW_WEIBO) {
                            this.loveData = statuses;
                            ToastAndroid.showWithGravity(`有${statuses.length}条新微博 :)`, ToastAndroid.SHORT, ToastAndroid.CENTER);
                            this.sinceID = tl.since_id;
                            this.maxID = tl.max_id;
                        } else {
                            this.loveData = this.loveData.concat(statuses);
                            ToastAndroid.showWithGravity(`挖出${statuses.length}条旧微博 :)`, ToastAndroid.SHORT, ToastAndroid.CENTER);
                            this.maxID = (tl.max_id < this.maxID || this.maxID === 0) ? tl.max_id : this.maxID;
                        }

                        //update the listview data
                        this.setState({
                            loveSource: this.state.loveSource.cloneWithRows(this.loveData)
                        });
                    } else {
                        ToastAndroid.showWithGravity('你的朋友很安静 zZ', ToastAndroid.SHORT, ToastAndroid.CENTER);
                    }
                } else {
                    ToastAndroid.showWithGravity('你的朋友找不到了 :(', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }

                //reset gettingTimeLine
                this.gettingTimeLine = false;
            },
            (err) => {
                ToastAndroid.showWithGravity(err, ToastAndroid.SHORT, ToastAndroid.CENTER);
                this.gettingTimeLine = false;
            }
        );
    }

    //The footer of the listview 
    getEnd(type) {
        if (type === GET_FOOTER) {
            return (
                <View style={{ alignItems: 'center' }} >
                    <View style={{ marginVertical: 7 }}>
                        <Button bordered info small onPress={() => this.getTimeLine(OLD_WEIBO)}> 更多 </Button>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ alignItems: 'center', backgroundColor: 'blue' }} >
                    <Button bordered> 加载中.. </Button>
                </View>
            );
        }
    }

    //Render
    render() {
        if (this.props.tab === TAB_LOVE) {
            //Time line
            return (
                <ListView
                    dataSource={this.state.loveSource}
                    renderRow={(rowData) => <WeiboCard weiData={rowData} navigator={this.props.navigator} />}
                    renderFooter={() => this.getEnd(GET_FOOTER)}
                />
            );
        } else if (this.props.tab === TAB_ME) {
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
                                <Icon style={{ fontSize: 20 }} name='ios-log-in' />
                                <Text style={{ fontSize: 20 }}>登陆</Text>
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
                    <View style={styles.cardStyle}>
                        <View View style={{ flex: 1 }}>
                            <View style={styles.cardInfo}>
                                <Thumbnail size={70} source={{ uri: this.state.userInfo.avatar_large }} />
                                <Text>{this.state.userInfo.name}</Text>
                                <Text style={{ color: 'silver' }}>{this.state.userInfo.description}</Text>
                            </View>
                            <View style={styles.logoInfo}>
                                <Button transparent>
                                    <Icon name="ios-heart" style={{ color: '#f1948a', fontSize: 20 }} />
                                    <Text style={{ fontSize: 20, color: '#626567' }}>{this.state.userInfo.friends_count}</Text>
                                </Button>
                                <Button transparent>
                                    <Icon name="ios-leaf" style={{ color: '#82e0aa', fontSize: 20 }} />
                                    <Text style={{ fontSize: 20, color: '#626567' }}>{this.state.userInfo.statuses_count}</Text>
                                </Button>
                                <Button transparent>
                                    <Icon name="ios-eye" style={{ color: '#85c1e9', fontSize: 20 }} />
                                    <Text style={{ fontSize: 20, color: '#626567' }}>{this.state.userInfo.followers_count}</Text>
                                </Button>
                            </View>
                        </View>
                        <View style={{ flex: 1, width: 100, marginTop: 10 }}>
                            <Button block danger onPress={() => this.onPressLogout()}>
                                <Icon style={{ fontSize: 20 }} name='md-log-out' />
                                <Text style={{ fontSize: 20 }}>登出</Text>
                            </Button>
                        </View>
                    </View>
                );
            }
            return content;
        }
    }
}


const styles = StyleSheet.create({
    cardStyle: {
        marginTop: 7,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: '#e5e8e8',
        borderRadius: 2,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },

    cardInfo: {
        flex: 5,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f4f6f7'
    },

    logoInfo: {
        marginTop: 30,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});