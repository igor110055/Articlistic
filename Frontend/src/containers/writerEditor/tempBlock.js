import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Unsplash from "../unsplash/unsplash";
import store from "./../../store";

export default class TempBlock {
  static get toolbox() {
    return {
      title: "Unsplash",
      icon: `
            
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
<g id="surface1">
<path style=" stroke:none;fillRule:nonzero;fill:rgb(16.862745%,25.098039%,43.137255%);fill-opacity:1;" d="M 22.75 46.167969 L 39.417969 46.167969 L 39.417969 60.917969 L 59.5 60.917969 L 59.5 46.25 L 76.167969 46.25 L 76.167969 75.917969 L 22.75 75.917969 Z M 22.75 46.167969 "/>
<path style=" stroke:none;fillRule:nonzero;fill:rgb(18.823529%,58.431373%,100%);fill-opacity:1;" d="M 59.082031 37.5 L 39.582031 37.5 L 39.582031 22.707031 L 59.082031 22.707031 Z M 59.082031 37.5 "/>
</g>
</svg>
`
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      url: data.url || "",
      caption: data.caption || ""
    };

    this.CSS = {
      wrapper: "walkthrough-timeline"
    };

    this.nodes = {
      holder: null
    };
  }

  render() {
    const rootNode = document.createElement("div");
    this.nodes.holder = rootNode;

    const onDataChange = (newData, caption) => {
      this.data = {
        url: newData,
        caption: caption
      };
    };

    ReactDOM.render(
      <Provider store={store}>
        <Unsplash
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
      url: this.data.url,
      caption: this.data.caption
    };
  }
}
