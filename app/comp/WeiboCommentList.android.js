import React, { Component } from 'react';
import { ListView, View, StyleSheet } from 'react-native';
import WeiboComment from './WeiboComment';

export default class WeiboCommentList extends Component {

    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        ds = ds.cloneWithRows(this.props.comments);
        this.state = {
            commentSource: ds,
        };
    }

    //Render
    render() {
        return (<ListView
            dataSource={this.state.commentSource}
            renderRow={(rowData) => <WeiboComment comment={rowData} />}
        />);
    }
}


const styles = StyleSheet.create({

});