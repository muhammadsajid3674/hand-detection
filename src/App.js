// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load handpose DONE
// 6. Detect function DONE
// 7. Drawing utilities DONE
// 8. Draw functions DONE

import React, { useRef } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
// import { drawHand } from "./utilities.js";
// import ringImg from "./img/ring.png";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imgURI = window.location.search
  let newStr = imgURI.substring(1);

  // window.location.href += imgURI
  console.log('URL :>> ', newStr);
  const runHandpose = async () => {
    try {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      //  Loop and detect hands
      setInterval(() => {
        detect(net);
      }, 100);
    } catch (error) {
      console.log('fetch error :>> ', error);
    }
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      console.log(hand);
      console.log('width :>> ', webcamRef.current.video);
      console.log('height :>> ', canvasRef.current.height);
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      ctx.rect(canvasRef.current.width / 2 - 250, canvasRef.current.height / 2 - (window.innerWidth < 600 ? 75 : 200), 500, (window.innerWidth < 600 ? 150 : 400));
      ctx.fillStyle = "transparent";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = hand.length > 0 ? "green" : "red";
      ctx.stroke();
      // drawHand(hand, ctx);
      if (ctx.strokeStyle === '#008000') {
        var img = document.getElementById("ringImg");
        ctx.drawImage(img, canvasRef.current.width / 2 - 20, canvasRef.current.height / 2 - (window.innerWidth < 600 ? 35 : 100), 40, (window.innerWidth < 600 ? 25 : 50));
      }
    }
  };

  runHandpose();

  return (
    <div className="App">
      <header className="App-header" style={{ position: 'relative' }}>
        <Webcam
          className="webCam"
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            height: 700,
          }}
        />

        <canvas
          id="myCanvas"
          className="canvas-width"
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            height: 700,
          }}
        />
        <img id="ringImg" src={newStr} alt="The Scream" style={{ display: 'none' }}></img>
      </header>
    </div>
  );
}

export default App;