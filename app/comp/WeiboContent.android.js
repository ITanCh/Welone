import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Footer, FooterTab, Button, Header, Text as TextBase, Icon } from 'native-base';
import TianTheme from '../theme/TianTheme';
import WeiboCard from './WeiboCard';
import WeiboCommentList from './WeiboCommentList';

import WeiboModule from './module/WeiboModule';

import { NEW_COMMENT, OLD_COMMENT } from './WeiboConstant';

export default class WeiboContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            sinceID: 0,
            maxID: 0
        };

        this.sinceID = 0;
        this.maxID = 0;
    }

    //navigate to the parent
    pressBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    //get weibo comments
    getComments(type) {
        let id = this.props.data.id;

        let since = 0;
        let max = 0;

        if (type === NEW_COMMENT) {
            since = this.state.sinceID;
        } else {
            max = this.state.maxID;
        }

        if (id) {
            WeiboModule.getShow(
                id.toString(),
                since.toString(),
                max.toString(),
                (success) => {
                    if (success.length > 0) {
                        let { comments } = JSON.parse(success);
                        if (comments && comments.length > 0) {
                            if (type === NEW_COMMENT) {
                                comments = comments.concat(this.state.comments);
                            } else {
                                comments = this.state.comments.concat(comments);
                            }

                            //TODO: disable getComment
                            this.setState({ comments: comments, sinceID: comments[0].id, maxID: comments[comments.length - 1].id - 1 });
                            if (this.refs.commentList) {
                                this.refs.commentList.setComments(comments);
                            }
                        }

                    } else {
                        ToastAndroid.showWithGravity("无法获得评论", ToastAndroid.SHORT, ToastAndroid.CENTER, )
                    }
                },
                (err) => {
                    ToastAndroid.showWithGravity(err, ToastAndroid.SHORT, ToastAndroid.CENTER)
                }
            );
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
                        <WeiboCard weiData={this.props.data} getComments={this.getComments.bind(this)} />
                    </View>
                    {this.renderComments()}
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


    renderComments() {
        if (this.state.comments && this.state.comments.length > 0) {
            return (<WeiboCommentList ref='commentList' comments={this.state.comments} getComments={this.getComments.bind(this)} />);
        }
        return null;
    }
}