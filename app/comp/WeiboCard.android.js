import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon } from 'native-base';

import WeiboContent from './WeiboContent'

export default class WeiboCard extends Component {

    render() {

        return (
            <Card style={{ flex: 1 }}>
                <CardItem>
                    <Thumbnail source={{ uri: this.props.weiData.user.profile_image_url }} />
                    <Text>{this.props.weiData.user.name}</Text>
                    <Text>{this.props.weiData.created_at}</Text>
                </CardItem>

                <CardItem cardBody>
                    <Image style={{ resizeMode: 'cover' }} source={{ uri: this.props.weiData.bmiddle_pic }} />
                    <Text>
                        {this.props.weiData.text}
                    </Text>
                </CardItem>

                <CardItem style={{ flexDirection: 'row' }}>
                    <Button transparent textStyle={{ color: '#87838B' }}>
                        <Icon name="logo-github" />
                        <Text>{this.props.weiData.reposts_count} stars</Text>
                    </Button>
                    <Button transparent textStyle={{ color: '#87838B' }}>
                        <Icon name="logo-github" />
                        <Text>{this.props.weiData.comments_count} stars</Text>
                    </Button>
                    <Button transparent textStyle={{ color: '#87838B' }}>
                        <Icon name="logo-github" />
                        <Text>{this.props.weiData.attitudes_count}</Text>
                    </Button>
                </CardItem>
            </Card>
        );
    }
}
