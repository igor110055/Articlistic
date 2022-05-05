import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./../../../store";
import Quote from "./quote";

export default class QuoteBlock {
  static get toolbox() {
    return {
      title: "Quote",
      icon: `
            <?xml version="1.0" encoding="UTF-8"?>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000px" height="1000px" viewBox="0 0 1000 1000" version="1.1">
            <g id="surface1">
            <path style=" stroke:none;fillRule:nonzero;fill:rgb(18.823529%,58.431373%,100%);fill-opacity:1;" d="M 440.417969 481.667969 L 377.917969 481.667969 C 377.019531 455.328125 392.417969 431.152344 416.667969 420.832031 C 432.199219 413.238281 438.636719 394.492188 431.042969 378.957031 C 423.449219 363.425781 404.699219 356.988281 389.167969 364.582031 C 343.90625 385.703125 315.5625 431.742188 317.082031 481.667969 L 317.082031 606.667969 C 317.082031 621.234375 328.769531 633.105469 343.332031 633.332031 L 441.667969 633.332031 C 456.394531 633.332031 468.332031 621.394531 468.332031 606.667969 L 468.332031 508.332031 C 468.339844 501.039062 465.359375 494.058594 460.085938 489.019531 C 454.8125 483.984375 447.703125 481.324219 440.417969 481.667969 Z M 440.417969 481.667969 "/>
            <path style=" stroke:none;fillRule:nonzero;fill:rgb(18.823529%,58.431373%,100%);fill-opacity:1;" d="M 657.917969 481.667969 L 595.417969 481.667969 C 594.308594 455.628906 609.15625 431.539062 632.917969 420.832031 C 648.09375 413.03125 654.359375 394.605469 647.082031 379.167969 C 639.4375 363.808594 620.839844 357.484375 605.417969 365 C 557.769531 387.664062 529.082031 437.410156 533.332031 490 L 533.332031 607.082031 C 533.332031 621.648438 545.019531 633.523438 559.582031 633.75 L 657.917969 633.75 C 672.480469 633.523438 684.167969 621.648438 684.167969 607.082031 L 684.167969 508.332031 C 684.167969 493.765625 672.480469 481.894531 657.917969 481.667969 Z M 657.917969 481.667969 "/>
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
      text: data.text || ""
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

    const onDataChange = newData => {
      // console.log(newData);
      this.data = {
        text: newData
      };
    };

    ReactDOM.render(
      <Provider store={store}>
        <Quote
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
      text: this.data.text
    };
  }
}
