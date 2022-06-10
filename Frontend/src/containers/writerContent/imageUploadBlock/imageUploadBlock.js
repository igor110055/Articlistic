import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./../../../store";
import ImageUpload from "./imageUpload";
// import imageIcon from "./../../../Images/toolbarIcons/image.svg";

export default class ImageUploadBlock {
  static get toolbox() {
    return {
      title: "Image",
      icon: `
            <?xml version="1.0" encoding="UTF-8"?>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
            <g id="surface1">
            <path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(18.823529%,58.431373%,100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 3.400313 14.55 L 7.780312 11.440312 L 11.16 15.15 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
            <path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(18.823529%,58.431373%,100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 8.64 17.920312 L 16.459688 9.93 L 20.599687 14.25 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
            <path style="fill:none;strokeWidth:1;stroke-linecap:butt;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 3.400313 4.960312 L 20.599687 4.960312 L 20.599687 17.920312 L 3.400313 17.920312 Z M 3.400313 4.960312 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
            <path style=" stroke:none;fillRule:nonzero;fill:rgb(18.823529%,58.431373%,100%);fill-opacity:1;" d="M 56 37.582031 C 56 41.703125 52.660156 45.042969 48.542969 45.042969 C 44.421875 45.042969 41.082031 41.703125 41.082031 37.582031 C 41.082031 33.464844 44.421875 30.125 48.542969 30.125 C 52.660156 30.125 56 33.464844 56 37.582031 Z M 56 37.582031 "/>
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
      caption: data.caption || "",
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

    const onDataChange = (newData, caption) => {
      // console.log(newData);
      this.data = {
        url: newData,
        caption: caption,
      };
    };

    ReactDOM.render(
      <Provider store={store}>
        <ImageUpload
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
      caption: this.data.caption,
    };
  }
}
