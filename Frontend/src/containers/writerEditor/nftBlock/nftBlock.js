import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import store from './../../../store';
import { Component } from "react";
import Nft from './nft';

export default class NftBlock {
    static get toolbox() {
        return {
            title: 'NFT',
            icon: `
            
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
<g id="surface1">
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(16.862745%,25.098039%,43.137255%);fill-opacity:1;" d="M 38.542969 34.457031 L 38.542969 66.667969 L 33.332031 66.667969 L 17.332031 42.667969 L 17.332031 66.667969 L 12.042969 66.667969 L 12.042969 34.457031 L 17.332031 34.457031 L 33.332031 58.332031 L 33.332031 34.457031 Z M 38.542969 34.457031 "/>
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(16.862745%,25.098039%,43.137255%);fill-opacity:1;" d="M 43.582031 34.5 L 62.5 34.5 L 62.5 38.667969 L 48.875 38.667969 L 48.875 48.332031 L 59.542969 48.332031 L 59.542969 52.5 L 48.875 52.5 L 48.875 66.667969 L 43.582031 66.667969 Z M 43.582031 34.5 "/>
<path style=" stroke:none;fill-rule:nonzero;fill:rgb(16.862745%,25.098039%,43.137255%);fill-opacity:1;" d="M 65.332031 34.5 L 87.832031 34.5 L 87.832031 38.667969 L 79.167969 38.667969 L 79.167969 66.667969 L 73.957031 66.667969 L 73.957031 38.792969 L 65.332031 38.792969 Z M 65.332031 34.5 "/>
</g>
</svg>
`
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, config, api, readOnly }) {
        // this.api = api;
        // this.readOnly = readOnly;
        // this.data = {
        //     events: data.events || [],
        // };
        // console.log(props);
        // super(props);

        // this.CSS = {
        //     wrapper: 'walkthrough-timeline',
        // };

        // this.nodes = {
        //     holder: null,
        // };

        // this.state = {
        //     url: props.data.url ? props.data.url : '',
        // };

        // this.setUrl = this.setUrl.bind(this);
        this.api = api;
        this.readOnly = readOnly;
        this.data = {
            url: data.url || '',
        };

        this.CSS = {
            wrapper: 'walkthrough-timeline',
        };

        this.nodes = {
            holder: null,
        };
    }
    // setUrl(url) {
    //     console.log(url);
    //     this.setState({ url });
    //     console.log(url);
    // }

    render() {
        const rootNode = document.createElement('div');
        this.nodes.holder = rootNode;

        const onDataChange = (newData) => {
            this.data = {
                url: newData,
            };
        }

        // console.log('kajdgh');

        ReactDOM.render(
            (
                <Provider store={store}>
                    <Nft onDataChange={onDataChange} data={this.data} readOnly={this.readOnly}/>
                </Provider>
            ),
            rootNode);
        return this.nodes.holder;
    }

    save() {
        return this.data;
    }
}