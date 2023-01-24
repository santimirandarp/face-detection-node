import { nets } from "@vladmandic/face-api";
import {
  TinyFaceDetectorOptions,
  SsdMobilenetv1Options,
  FaceDetectorNode,
} from "..";
/**
 * Modifies global settings
 * @param opts - FaceDetectionOptions
 * @param models - absolute path to models
 * @returns
 */
export async function loadNNFromOptions(this: FaceDetectorNode) {
  const opts = this.model.detectionOptions;
  const models = this.configPath.modelsDir;
  console.log("loading neural network...");
  if (opts instanceof TinyFaceDetectorOptions) {
    await nets["tinyFaceDetector"].loadFromDisk(models);
  } else if (opts instanceof SsdMobilenetv1Options) {
    await nets["ssdMobilenetv1"].loadFromDisk(models);
  } else {
    throw new Error("No NN found in options");
  }
  this.isNNLoaded = true;
  return;
}
