import {
  SsdMobilenetv1Options,
  /*TinyFaceDetectorOptions,*/
  FaceDetectorNode,
} from "../src";

const configPath = {
  root: __dirname,
  imgDirOrFile: "./in/",
  outDir: "./out/",
  modelsDir: "../models",
  stats: "./stats.json",
  ignore: (filepath: string) => !/.jpg$|.jpeg$/.test(filepath),
  confirmPaths: true, //confirm path once before saving.
};

/* optionally use this model, but it's not as accurate
const modelConfig = {
  singleFace: true,
  detectionOptions: new TinyFaceDetectorOptions({
    scoreThreshold: 0.5,
  }),
};
*/
const configNN = {
  singleFace: false, //multi face detection
  detectionOptions: new SsdMobilenetv1Options({
    minConfidence: 0.36,
    maxResults: 6,
  }),
};

async function main() {
  const detector = new FaceDetectorNode(configPath, configNN);
  await detector.loadNN(); // load NN
  const annotateAndSave = true; //writes out to disk.
  await detector.detectAll(annotateAndSave);
}

main();
