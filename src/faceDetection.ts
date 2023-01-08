import * as faceapi from "@vladmandic/face-api";

import {
  canvas,
  faceDetectionNet,
  faceDetectionOptions,
  saveFile,
} from "./setUp";

async function run() {
  await faceDetectionNet.loadFromDisk("./models");

  const img = await canvas.loadImage("../images/face.jpeg");
  const detections = await faceapi.detectSingleFace(img, faceDetectionOptions);
  if (detections) {
    const out = faceapi.createCanvasFromMedia(img) as any;
    faceapi.draw.drawDetections(out, detections);
    //saveFile("faceDetection.jpg", out.toBuffer("image/jpeg"));
    console.log(`done, saved results to out/face.jpg`);
  }
}

run();
