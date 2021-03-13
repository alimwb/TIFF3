import React from "react";
import ReactDOM from "react-dom";
import UTIF from "utif";

import { Stage, Layer, Image } from "react-konva";

import "./styles.css";

class App extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://res.cloudinary.com/dp3xtuxsm/image/upload/v1603284929/file_example_TIFF_1MB_q05h7x.tiff"
    );
    xhr.responseType = "arraybuffer";
    xhr.onload = (e) => {
      const ifds = UTIF.decode(e.target.response);
      const firstPageOfTif = ifds[0];
      UTIF.decodeImages(e.target.response, ifds);
      const rgba = UTIF.toRGBA8(firstPageOfTif);

      const imageWidth = firstPageOfTif.width;
      const imageHeight = firstPageOfTif.height;

      const cnv = document.createElement("canvas");
      cnv.width = imageWidth;
      cnv.height = imageHeight;

      const ctx = cnv.getContext("2d");
      const imageData = ctx.createImageData(imageWidth, imageHeight);
      for (let i = 0; i < rgba.length; i++) {
        imageData.data[i] = rgba[i];
      }
      ctx.putImageData(imageData, 0, 0);

      this.setState({
        image: cnv
      });
    };
    xhr.send();
  }

  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Image image={this.state.image} />
        </Layer>
      </Stage>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
