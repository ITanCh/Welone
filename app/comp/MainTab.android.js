import React, { Component } from 'react';
import { View } from 'react-native';

import { Container, Content, Footer, FooterTab, Button, Icon, Header, Title } from 'native-base';

import WeiboList from './WeiboList'

export default class MainTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'Love',
        };
    }

    onPressTab(tab) {
        this.setState({ activeTab: tab })
    }

    render() {
        return (
            <Container>
                <Header>
                    <Title>{this.state.activeTab}</Title>
                </Header>

                <Content>
                    <View style={{ marginHorizontal: 7 }}>
                        <WeiboList tab={this.state.activeTab} />
                    </View>
                </Content>

                <Footer >
                    <FooterTab>
                        <Button onPress={() => this.onPressTab('Love')}>
                            Love
                            <Icon name='ios-heart' />
                        </Button>
                        <Button onPress={() => this.onPressTab('Me')}>
                            Me
                            <Icon name='ios-ice-cream' />
                        </Button>
                        <Button onPress={() => this.onPressTab('Set')}>
                            Set
                            <Icon name='ios-settings' />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}
