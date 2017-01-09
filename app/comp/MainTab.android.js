import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';

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
                    <WeiboList tab={this.state.activeTab} />
                </Content>

                <Footer >
                    <FooterTab>
                        <Button onPress={() => this.onPressTab('Love')}>
                            <Icon name='ios-heart' />
                            Love
                        </Button>
                        <Button onPress={() => this.onPressTab('Me')}>
                            Me
                            <Icon name='ios-ice-cream' />
                        </Button>
                        <Button onPress={() => this.onPressTab('Set')}>
                            Set
                            <Icon name='ios-contact' />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}
