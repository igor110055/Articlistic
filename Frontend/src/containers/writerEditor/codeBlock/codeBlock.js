import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./../../../store";
import Code from "./code";

export default class CodeBlock {
  static get toolbox() {
    return {
      title: "Code",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
            <g id="surface1">
            <path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 13.669688 8.04 L 18.39 12 L 13.669688 15.96 " transform="matrix(4.166667,0,0,4.166667,0,0)"></path>
            <path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 10.330312 8.04 L 5.61 12 L 10.330312 15.96 " transform="matrix(4.166667,0,0,4.166667,0,0)"></path>
            </g>
            </svg>`,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      text: data.text || "",
    };

    this.CSS = {
      wrapper: "walkthrough-timeline",
    };

    this.nodes = {
      holder: null,
    };
  }

  render() {
    const rootNode = document.createElement("div");
    this.nodes.holder = rootNode;

    const onDataChange = (newData) => {
      // console.log(newData);
      this.data = {
        text: newData,
      };
    };

    ReactDOM.render(
      <Provider store={store}>
        <Code
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
    return {
      text: this.data.text,
    };
  }
}
