import React, { Component } from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Icon, Header, Text as TextBase } from 'native-base';

import TianTheme from '../theme/TianTheme'
import WeiboCard from './WeiboCard'

export default class WeiboContent extends Component {

    render() {
        return (
            <Container>
                <Header theme={TianTheme}>
                    <View style={{ alignItems: 'center', flex: 1, marginRight: 15 }}>
                        <TextBase>微博详情</TextBase>
                    </View>
                </Header>

                <Content style={{ backgroundColor: '#f8f9f9' }}>
                    <View style={{ marginHorizontal: 7 }}>
                        <WeiboCard weiData={this.props.data} />
                    </View>
                </Content>

                <Footer theme={TianTheme} style={{ borderTopWidth: 1, borderTopColor: '#e5e8e8' }}>
                    <FooterTab>
                        <Button onPress={() => this.onPressTab(TAB_LOVE)}>
                            <Icon name='ios-heart' />
                        </Button>
                        <Button onPress={() => this.onPressTab(TAB_ME)}>
                            <Icon name='ios-ice-cream' />
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