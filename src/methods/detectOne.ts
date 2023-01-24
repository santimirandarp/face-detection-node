import { readFileSync } from "node:fs";
import {
  detectSingleFace,
  detectAllFaces,
  type FaceDetection,
  type FaceDetectionOptions,
} from "@vladmandic/face-api";

import * as canvas from "canvas";
import { type FaceDetectorNode } from "../FaceDetectorNode";
/**
 * Mostly for internal use but can be used to detect faces in a single image
 * @param this - FaceDetectorNode
 * @param file - Buffer or string
 * @returns detections object
 */
export async function detectOne(this: FaceDetectorNode, file?: Buffer) {
  const detectionOptions = this.model.detectionOptions;
  const cleanFile = file ?? (await this.inputs)[this.offset++];
  const buffer =
    typeof cleanFile === "string" ? readFileSync(cleanFile) : cleanFile;
  //only buffer allowed as input in nodejs.
  const img = await canvas.loadImage(buffer);
  const detection = this.model.singleFace
    ? await singleDetection(img, detectionOptions)
    : await multiDetection(img, detectionOptions);
  return { canvasImage: img, detection };
}

/*
 * Wraps face-api functions to make the return type
 * homogeneous.
 */

/**
 *
 * @param path - absolute path to the image input file
 * @param options - the options for the detection, that are input to the NN.
 */
async function singleDetection(
  img: canvas.Image,
  options?: FaceDetectionOptions
): Promise<FaceDetection | null> {
  const detection = await detectSingleFace(img as any, options);
  return detection ?? null;
}

/**
 *
 * @param path - absolute path to the image input file
 * @param options - the options for the detections, that are input to the NN.
 */
async function multiDetection(
  img: canvas.Image,
  options?: FaceDetectionOptions
): Promise<FaceDetection[] | null> {
  const detections = await detectAllFaces(img as any, options);
  return detections.length > 0 ? detections : null;
}
