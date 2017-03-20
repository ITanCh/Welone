import React, { Component } from 'react';
import { ListView, View } from 'react-native';
import { Button } from 'native-base';
import WeiboComment from './WeiboComment';

import { OLD_COMMENT } from './WeiboConstant';

export default class WeiboCommentList extends Component {

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        ds = ds.cloneWithRows(this.props.comments);
        this.state = {
            commentSource: ds,
        };
    }

    //called by WeiboContent
    setComments(comments) {
        this.setState({ commentSource: this.state.commentSource.cloneWithRows(comments) });
    }

    //call the function of WeiboContent
    getComments() {
        if (this.props.getComments) {
            this.props.getComments(OLD_COMMENT);
        }
    }

    //The footer of the listview 
    getEnd() {
        return (
            <View style={{ alignItems: 'center' }} >
                <View style={{ marginVertical: 7 }}>
                    <Button bordered info small onPress={() => this.getComments()}> 更多 </Button>
                </View>
            </View>
        );
    }

    //Render
    render() {
        return (
            <View style={{ marginVertical: 5, marginHorizontal: 20, borderWidth: 0.5, borderColor: '#e5e8e8', backgroundColor: '#ffffff' }} >
                <ListView
                    dataSource={this.state.commentSource}
                    renderRow={(rowData) => <WeiboComment comment={rowData} />}
                    renderFooter={() => this.getEnd()}
                />
            </View>
        );
    }
}