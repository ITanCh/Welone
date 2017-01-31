import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class WeiboImage extends Component {

    constructor(props) {
        super(props);

        let lc = null;

        if (this.props.picUrls.length === 1) {
            let thumbnailUrl = this.props.picUrls[0].thumbnail_pic;
            let bmiddleUrl = thumbnailUrl.replace('thumbnail', 'bmiddle');
            lc = (
                <View style={{ marginTop: 7 }}>
                    <Image style={{ height: 200, resizeMode: 'contain' }} source={{ uri: bmiddleUrl }} />
                </View>
            );
        } else if (this.props.picUrls.length > 1) {

        }

        this.state = {
            content: lc
        }

    }

    render() {
        return this.state.content;
    }
}