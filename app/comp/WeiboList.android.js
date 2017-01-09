import React, { Component } from 'react';
import { ListView, Text, View } from 'react-native';
import WeiboCard from './WeiboCard'
import WeiboContent from './WeiboContent'

export default class WeiboList extends Component {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        var a = new WeiboContent('xiaxia', '../assets/12.jpg', '2017-1-1', 'nihao woshihahahah,nihao', '../assets/12.jpg', 123, 456);
        var b = new WeiboContent('dada', '../assets/12.jpg', '2017-1-1', 'nihao woshihahahah,nihao', '../assets/12.jpg', 123, 456);
        var c = new WeiboContent('lulu', '../assets/12.jpg', '2017-1-1', 'nihao woshihahahah,nihao', '../assets/12.jpg', 123, 456);

        this.state = {
            loveSource: ds.cloneWithRows([
                a, b
            ]),
            meSource: ds.cloneWithRows([
                c
            ])
        };
    }

    render() {
        if (this.props.tab === 'Love') {
            return (
                <ListView
                    dataSource={this.state.loveSource}
                    renderRow={(rowData) => <WeiboCard weiData={rowData} />}
                    />
            );
        } else if (this.props.tab === 'Me') {
            return (
                <ListView
                    dataSource={this.state.meSource}
                    renderRow={(rowData) => <WeiboCard weiData={rowData} />}
                    />
            );
        } else {
            return (<Text>Set</Text>);
        }
    }
}
