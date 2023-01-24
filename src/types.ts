import type {
  FaceDetection,
  SsdMobilenetv1Options,
  TinyFaceDetectorOptions,
} from "@vladmandic/face-api";

export type Image = any;
export type AnnotatedImage = any;
export type Annotation = (
  img: Image,
  detection: FaceDetection | FaceDetection[]
) => AnnotatedImage;

export interface Logs {
  filename: string[];
  error: string[];
  total: number;
}

export interface ConfigModel {
  /**
   * Defines whether to use singleFaceDetector, or multiFaceDetector.
   * @defaultValue false
   */
  singleFace?: boolean;
  /**
   * The Tiny one is less accurate, way lighter and faster.
   * @defaultValue `new SsdMobilenetv1Options({minConfidence:0.5, maxResults:1})`
   */
  detectionOptions?: SsdMobilenetv1Options | TinyFaceDetectorOptions;
  /**
   * Array of functions with access to detection @see {@link Annotation}
   * @defaultValue `[score, mask]`
   */
  annotations?: Annotation[];
}

/** Addresses used by the programs, or the default is used if the address is not present. */
export interface ConfigPaths {
  /*
   * remaining paths are relative to this one.
   * Pass `__dirname` or an equivalent.
   */
  root: FullPath;
  /** @defaultValue "../images/", where to search for images relative to main script path */
  imgDirOrFile?: RelativePath;
  /** @defaultValue "./models", where to search for models relative to main script path */
  modelsDir?: RelativePath;
  /**
   * set the file path, or edit this function's input path
   * @defaultValue "./out", directory from where to store images
   */
  outDir?: RelativePath;
  /**
   * function must return true if the path should be ignored
   */
  ignore?: ((root: FullPath) => boolean) | null;
  /**
   * @defaultValue true, if true, the user will be prompted to confirm the paths once.
   */
  confirmPaths?: boolean;
}

export type FullPath = string;
export type RelativePath = string;

export type Detections = {
  input: FullPath;
  detection: null | FaceDetection | FaceDetection[];
  outputs?: FullPath[];
};
