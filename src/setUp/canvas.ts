import "@tensorflow/tfjs-node";

import * as faceapi from "@vladmandic/face-api";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
const canvas = require("canvas");

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export { canvas };
