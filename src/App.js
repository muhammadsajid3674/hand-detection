import React, { useRef, useState } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import useWindowSize from "./hook";
// import { drawHand } from "./utilities.js";
import ringImg from "./img/Hand-Scanner.png";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setLoader] = useState(true)
  const [isDetected, setDetected] = useState(false)
  const imgURI = window.location.search
  let newStr = imgURI.split("==");
  let imgType = newStr[1];
  let imgUrl = newStr[3];

  const size = useWindowSize();
  const runHandpose = async () => {
    try {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      //  Loop and detect hands
      setInterval(() => {
        detect(net);
      }, 100);
      setLoader(false)

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
      webcamRef.current.video.width = window.innerWidth;
      webcamRef.current.video.height = window.innerHeight;

      // Set canvas height and width
      // canvasRef.current.width = videoWidth;
      // canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      hand.length > 0 ? setDetected(true) : setDetected(false);

      // Draw mesh
      // const ctx = canvasRef.current.getContext("2d");
      // ctx.rect(
      //   0,
      //   0,
      //   280,
      //   480
      // );
      // ctx.fillStyle = "transparent";
      // ctx.fill();
      // ctx.lineWidth = 4;
      // ctx.strokeStyle = hand.length > 0 ? "green" : "red";
      // ctx.stroke();

      // drawHand(hand, ctx);
      // if (ctx.strokeStyle === '#008000') {
      //   var img = document.getElementById("ringImg");
      //   if (imgType === 'ring') {
      //     ctx.drawImage(img, canvasRef.current.width / 2 - 20, canvasRef.current.height / 2 - 100, 40, 50);
      //   } else if (imgType === 'bracelet') {
      //     ctx.drawImage(img, canvasRef.current.width / 2 - 40, canvasRef.current.height / 2 - 25, 80, 50);
      //   }
      // }
    }
  };

  runHandpose();
  return (
    <div className="App" >
      <header className="App-header" style={{ position: 'relative' }}>
        {isLoading ? <div className="basic"></div> : <>
          <Webcam
            className="webcamCapture"
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
            }}
            mirrored={false}
          // videoConstraints={{
          //   width: { ideal: 280 },
          //   height: { ideal: 480 },
          //   facingMode: 'enviroment'
          // }}
          />

          {/* <canvas
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
            }}
          /> */}
          {!isDetected && <img id="ringImg" className="scanner-image" src={ringImg} alt="" style={{ display: 'block', zIndex: 12465, width: '30%' }} />}
          {isDetected && imgType === 'ring' && <img id="ring" src={imgUrl} alt="" />}
          {isDetected && imgType === 'bracelet' && <img id="bracelet" src={imgUrl} alt="" />}
        </>}
      </header>
    </div>
  );
}

export default App;