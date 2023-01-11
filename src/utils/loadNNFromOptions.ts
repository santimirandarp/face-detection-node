import * as faceapi from "@vladmandic/face-api";
/**
 * Modifies global settings
 * @param opts - FaceDetectionOptions
 * @param models - absolute path to models
 * @returns
 */
export async function loadNNFromOptions(
  opts: faceapi.FaceDetectionOptions,
  models: string
) {
  if (opts instanceof faceapi.TinyFaceDetectorOptions) {
    await faceapi.nets["tinyFaceDetector"].loadFromDisk(models);
  } else if (opts instanceof faceapi.TinyYolov2Options) {
    await faceapi.nets["tinyYolov2"].loadFromDisk(models);
  } else if (opts instanceof faceapi.SsdMobilenetv1Options) {
    await faceapi.nets["ssdMobilenetv1"].loadFromDisk(models);
  } else {
    throw new Error("No NN found in options");
  }
  return;
}
