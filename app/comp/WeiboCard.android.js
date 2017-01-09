import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon } from 'native-base';

import WeiboContent from './WeiboContent'

export default class WeiboCard extends Component {

    render() {

        return (
            <Card style={{ flex: 1 }}>
                <CardItem>
                    <Thumbnail source={require('../assets/12.jpg')} />
                    <Text>{this.props.weiData.name}</Text>
                    <Text note>{this.props.weiData.time}</Text>
                </CardItem>

                <CardItem cardBody>
                    <Image style={{ resizeMode: 'cover' }} source={require('../assets/12.jpg')} />
                    <Text>
                    {this.props.weiData.text}
                    </Text>
                </CardItem>

                <CardItem style={{ flexDirection: 'row' }}>
                    <Button transparent textStyle={{ color: '#87838B' }}>
                        <Icon name="logo-github" />
                        <Text>{this.props.weiData.comCount} stars</Text>
                    </Button>
                    <Button transparent textStyle={{ color: '#87838B' }}>
                        <Icon name="logo-github" />
                        <Text>{this.props.weiData.likeCount} stars</Text>
                    </Button>
                    <Button transparent textStyle={{ color: '#87838B' }}>
                        <Icon name="logo-github" />
                        <Text>1,926 stars</Text>
                    </Button>
                </CardItem>
            </Card>
        );
    }
}
