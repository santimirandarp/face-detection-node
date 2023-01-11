import { faceDetection } from "./src/faceDetection";
import { SsdMobilenetv1Options } from "@vladmandic/face-api";

const geo = "./images/unzipped/original/FRA";
const all = "./images/unzipped/original/";
faceDetection(__dirname, all, "./src/models", {
  singleFace: false, //multiple faces.
  singleFile: false, //recursively read dirs.
  detectionOptions: new SsdMobilenetv1Options({
    minConfidence: 0.36,
    maxResults: 2,
  }), //store any errors. Also adds "noface" to filepath ITIN.
  outStatsPath: "./stats.json",
});

/**
const randomImage = "./images/testTwoFaces.jpg";
faceDetection(__dirname, randomImage, "./src/models", {
  singleFace: false,
  singleFile: true,
  outStatsPath: "./stats.json",
  detectionOptions: new faceapi.TinyFaceDetectorOptions({
    inputSize: 32 * 10,
    scoreThreshold: 0.3,
  }),
});
*/
