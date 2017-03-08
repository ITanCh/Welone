import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { Container, Content, Footer, FooterTab, Button, Icon, Header, Text as TextBase } from 'native-base';

import WeiboList from './WeiboList'
import { NEW_WEIBO, OLD_WEIBO, TAB_LOVE, TAB_ME, TAB_SET } from './WeiboConstant';

import TianTheme from '../theme/TianTheme'

export default class MainTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: TAB_LOVE,
        };

        this.weiboList = null;
    }

    onPressTab(tab) {
        //Double clicking this tab will refresh weibo content
        if (tab === TAB_LOVE && this.state.activeTab === TAB_LOVE) {
            if (this.weiboList != null) {
                this.weiboList.getTimeLine(NEW_WEIBO);
            }
        }
        this.setState({ activeTab: tab })
    }

    getTabTitle() {
        if (this.state.activeTab === TAB_LOVE) {
            return '关注';
        } else if (this.state.activeTab === TAB_ME) {
            return '消息';
        } else {
            return '设置';
        }
    }

    render() {
        return (
            <Container theme={TianTheme}>
                <Header>
                    <View style={{ alignItems: 'center', flex: 1, marginRight: 15 }}>
                        <TextBase>{this.getTabTitle()}</TextBase>
                    </View>
                </Header>

                <Content style={{ backgroundColor: '#f8f9f9' }}>
                    <View style={{ marginHorizontal: 7 }}>
                        <WeiboList
                            navigator={this.props.navigator}
                            ref={(weiboList) => { this.weiboList = weiboList }}
                            tab={this.state.activeTab}
                        />
                    </View>
                </Content>

                <Footer style={{ borderTopWidth: 1, borderTopColor: '#e5e8e8' }}>
                    <FooterTab>
                        <Button onPress={() => this.onPressTab(TAB_LOVE)}>
                            <Icon name='ios-heart' />
                        </Button>
                        <Button onPress={() => this.onPressTab(TAB_ME)}>
                            <Icon name='ios-chatbubbles' />
                        </Button>
                        <Button onPress={() => this.onPressTab(TAB_SET)}>
                            <Icon name='ios-settings' />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}
