import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import store from './../../../store';
import { Component } from "react";
import Delimiter from "./delimiter";

export default class DelimiterBlock extends Component {
    static get toolbox() {
        return {
            title: 'Divider',
            icon: `
            
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
<g id="surface1">
<path style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 7.23 12.15 L 17.88 12.15 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(18.823529%,58.431373%,100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 4.939687 12.15 L 5.19 12.15 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
</g>
</svg>
`,
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor(props) {
        // this.api = api;
        // this.readOnly = readOnly;
        // this.data = {
        //     events: data.events || [],
        // };
        super(props);

        this.CSS = {
            wrapper: 'walkthrough-timeline',
        };

        this.nodes = {
            holder: null,
        };
    }

    render() {
        const rootNode = document.createElement('div');
        this.nodes.holder = rootNode;

        ReactDOM.render(
            (
                <Provider store={store}>
                    <Delimiter />
                </Provider>
            ),
            rootNode);
        return this.nodes.holder;
    }

    save() {
        return {
            url: 'delimeter',
        }
    }
}