import type { FaceDetection } from "@vladmandic/face-api";
export default function formatScore(
  detection: FaceDetection | FaceDetection[]
): string {
  let result = "";
  if (Array.isArray(detection)) {
    for (const d of detection) {
      result += `0${percentage(d.score)}_`;
    }
  } else {
    result = `0${percentage(detection.score)}_`;
  }
  return result;
}

function percentage(n: number) {
  return Math.round(n * 100);
}
