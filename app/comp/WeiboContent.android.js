import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Header, Text as TextBase, Icon } from 'native-base';
import TianTheme from '../theme/TianTheme';
import WeiboCard from './WeiboCard';

export default class WeiboContent extends Component {

    //navigate to the parent
    pressBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <Container theme={TianTheme}>
                <Header>
                    <View style={{ alignItems: 'center', flex: 1, marginRight: 15 }}>
                        <TextBase>微博详情</TextBase>
                    </View>
                </Header>

                <Content style={{ backgroundColor: '#f8f9f9' }}>
                    <View style={{ marginHorizontal: 7 }}>
                        <WeiboCard weiData={this.props.data} />
                    </View>
                </Content>

                <Footer style={{ borderTopWidth: 1, borderTopColor: '#e5e8e8' }}>
                    <FooterTab>
                        <Button>
                            <Icon name='ios-share' />
                        </Button>
                        <Button>
                            <Icon name='ios-chatboxes' />
                        </Button>
                        <Button>
                            <Icon name='ios-thumbs-up' />
                        </Button>
                        <Button onPress={() => this.pressBack()}>
                            <Icon name='md-close' />
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}