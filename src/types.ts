import { FaceDetectionOptions } from "@vladmandic/face-api";
import { Annotation } from "./utils/annotateImage";

export interface Logs {
  filename: string[];
  error: string[];
  total: number;
}
export interface ExecOptions {
  /**
   * where to save the stats of what was processed
   * by default it wont save
   * @default undefined
   */
  outStatsPath?: string;
  /*
   * set the file path, or edit this function's input path
   * The function is run for each file, so it is quite expensive.
   */
  outDirPath?: string | ((dirname: string) => string);
  /**
   * @default false
   */
  singleFace?: boolean;
  /**
   *
   * @param absoluteFilePath
   * @returns
   * @default - test for jpg extension
   */
  pathFilter?: (absoluteFilePath: string) => boolean;
  /**
   * By default detectAllFaces and detectSingleFace utilize the SSD Mobilenet V1 Face Detector.
   * @default new SsdMobilenetv1Options({minConfidence:0.5, maxResults:1})
   */
  detectionOptions?: FaceDetectionOptions;
  /**
   * Array of functions that independently annotate the image
   */
  annotations?: Annotation[];
  singleFile?: boolean;
}
