import type canvas from "canvas";
import {
  detectSingleFace,
  detectAllFaces,
  type FaceDetection,
  type FaceDetectionOptions,
} from "@vladmandic/face-api";

/**
 * This function is useless on its own, but it runs a specific
 * job based on a pre-configured faceapi object.
 *
 * @param faceapi - the prepared face api object
 * @param path - absolute path to the image input file
 * @param options - the options for the detection, that are input to the NN.
 */
export async function singleDetection(
  img: canvas.Image,
  options: FaceDetectionOptions
): Promise<[canvas.Image, FaceDetection] | null> {
  const detection = await detectSingleFace(img as any, options);
  return detection ? [img, detection] : null;
}

/**
 * This function is useless on its own, but it runs a specific
 * job based on a pre-configured faceapi object.
 *
 * @param path - absolute path to the image input file
 * @param options - the options for the detections, that are input to the NN.
 */
export async function multiDetection(
  img: canvas.Image,
  options: FaceDetectionOptions
): Promise<[canvas.Image, FaceDetection[]] | null> {
  const detections = await detectAllFaces(img as any, options);
  return detections.length > 0 ? [img, detections] : null;
}
