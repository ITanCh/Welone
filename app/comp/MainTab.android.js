import React, { Component } from 'react';
import { View } from 'react-native';

import { Container, Content, Footer, FooterTab, Button, Icon, Header, Title } from 'native-base';

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

    render() {
        return (
            <Container>
                <Header theme={TianTheme}>
                    <Title>{this.state.activeTab}</Title>
                </Header>

                <Content style={{ backgroundColor: '#f8f9f9' }}>
                    <View style={{ marginHorizontal: 7 }}>
                        <WeiboList ref={(weiboList) => { this.weiboList = weiboList } } tab={this.state.activeTab} />
                    </View>
                </Content>

                <Footer >
                    <FooterTab>
                        <Button onPress={() => this.onPressTab(TAB_LOVE)}>
                            Love
                            <Icon name='ios-heart' />
                        </Button>
                        <Button onPress={() => this.onPressTab(TAB_ME)}>
                            Me
                            <Icon name='ios-ice-cream' />
                        </Button>
                        <Button onPress={() => this.onPressTab(TAB_SET)}>
                            Set
                            <Icon name='ios-settings' />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}
