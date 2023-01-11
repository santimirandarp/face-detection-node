import {
  type FaceDetection,
  createCanvasFromMedia,
  draw,
} from "@vladmandic/face-api";

type Image = any;
type AnnotatedImage = any;
export type Annotation = (
  img: Image,
  detection: FaceDetection | FaceDetection[]
) => AnnotatedImage;

// returns canvas
export const score: Annotation = function score(img, detection) {
  const out = createCanvasFromMedia(img) as any;
  draw.drawDetections(out, detection);
  return out;
};
// returns canvas
export const mask: Annotation = function mask(img, detection) {
  const out = createCanvasFromMedia(img) as any;
  if (Array.isArray(detection)) {
    for (const d of detection) {
      const { x, y, width, height } = d.box;
      out.getContext("2d").fillRect(x, y, width, height);
    }
  } else {
    const { x, y, width, height } = detection.box;
    out.getContext("2d").fillRect(x, y, width, height);
  }
  return out;
};
