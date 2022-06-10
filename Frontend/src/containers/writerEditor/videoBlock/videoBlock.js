import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Video from "./video";
import store from "./../../../store";
import { Component } from "react";

export default class VideoBlock {
  static get toolbox() {
    return {
      title: "Video",
      icon: `
            <?xml version="1.0" encoding="UTF-8"?>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120px" height="120px" viewBox="0 0 120 120" version="1.1">
            <g id="surface1">
            <path style="fill:none;strokeWidth:1;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 3.3 5.220313 L 20.660156 5.220313 L 20.660156 18.3 L 3.3 18.3 Z M 3.3 5.220313 " transform="matrix(5,0,0,5,0,0)"/>
            <path style="fill:none;strokeWidth:1;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(18.823529%,58.431373%,100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 14.689844 11.879688 L 12.170313 13.329688 L 9.660156 14.779688 L 9.660156 8.970313 L 12.170313 10.429688 Z M 14.689844 11.879688 " transform="matrix(5,0,0,5,0,0)"/>
            </g>
            </svg>
            `,
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
      url: data.url || "",
    };

    this.CSS = {
      wrapper: "walkthrough-timeline",
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
    const rootNode = document.createElement("div");
    this.nodes.holder = rootNode;

    const onDataChange = (newData) => {
      // console.log(newData);
      this.data = {
        url: newData,
      };
    };

    ReactDOM.render(
      <Provider store={store}>
        <Video
          onDataChange={onDataChange}
          data={this.data}
          readOnly={this.readOnly}
        />
      </Provider>,
      rootNode
    );
    return this.nodes.holder;
  }

  save() {
    return this.data;
  }
}
