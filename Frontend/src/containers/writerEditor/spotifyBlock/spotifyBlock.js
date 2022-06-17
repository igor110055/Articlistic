import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Spotify from "./spotify";
import store from "./../../../store";

export default class SpotifyBlock {
  static get toolbox() {
    return {
      title: "Spotify",
      icon: `
            
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
<g id="surface1">
<path style="fill:none;strokeWidth:0.75;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(18.823529%,58.431373%,100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 16.480313 7.189687 C 16.142812 6.099375 15.301875 5.235937 14.22 4.870312 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:0.75;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(18.823529%,58.431373%,100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 17.76 7.000312 C 17.229375 5.295 15.913125 3.947812 14.22 3.379687 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:0.75;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(18.823529%,58.431373%,100%);stroke-opacity:1;stroke-miterlimit:4;" d="M 19.420312 6.69 C 18.69 4.364063 16.890937 2.5275 14.58 1.750312 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 16.639688 10.900313 L 16.639688 13.56 C 16.629375 16.193437 14.49375 18.324375 11.860312 18.33 C 9.229687 18.31875 7.100625 16.189687 7.090312 13.56 L 7.090312 10.900313 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11.629687 6.199687 L 12.100312 6.199687 C 13.74 6.199687 15.070312 7.53 15.070312 9.169688 L 15.070312 13.89 C 15.070312 15.530625 13.74 16.86 12.100312 16.86 L 11.629687 16.86 C 9.99 16.86 8.659688 15.530625 8.659688 13.89 L 8.659688 9.169688 C 8.659688 7.53 9.99 6.199687 11.629687 6.199687 Z M 11.629687 6.199687 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 8.659688 9.169688 L 11.860312 9.169688 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 8.659688 11.01 L 11.860312 11.01 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 8.659688 12.850312 L 11.860312 12.850312 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 11.860312 18.33 L 11.860312 20.290312 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
<path style="fill:none;strokeWidth:1;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(16.862745%,25.098039%,43.137255%);stroke-opacity:1;stroke-miterlimit:4;" d="M 8.530312 20.7 L 15.199687 20.7 " transform="matrix(4.166667,0,0,4.166667,0,0)"/>
</g>
</svg>
`,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, api, readOnly }) {
    // this.api = api;
    this.readOnly = readOnly;
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
        <Spotify
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
