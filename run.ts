import { faceDetection } from "./src/faceDetection";
import { SsdMobilenetv1Options } from "@vladmandic/face-api";

faceDetection(__dirname, "./images", "./src/models");
/* 
 both should work (second one just shows the defaults.) 
the first one searches recursively from ./images 
*/
/**
const all = "./images/unzipped/original/";
faceDetection(__dirname, all, "./src/models", {
  singleFace: false,
  singleFile: true,
  outStatsPath: "./stats.json",
  detectionOptions: new SsdMobilenetv1Options({
    minConfidence: 0.36,
    maxResults: 2,
  }),
});
 */
