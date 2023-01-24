import { join } from "path";
import { Detections } from "../types";

export function renameFile(
  outDir: string,
  annotation: string,
  filename: string,
  detection?: Detections["detection"]
): string {
  if (!detection) {
    return join(outDir, annotation, filename);
  }
  const nf = Array.isArray(detection) ? detection.length : 1;
  const output = join(
    outDir,
    `_${nf}_${annotation}`,
    `${formatScore(detection)}${filename}`
  );
  return output;
}

function formatScore(detection: Detections["detection"]): string {
  let result = "";
  if (Array.isArray(detection)) {
    for (const d of detection) {
      result += `0${percentage(d.score)}_`;
    }
  } else if (detection) {
    result = `0${percentage(detection.score)}_`;
  }
  return result;
}

function percentage(n: number) {
  return Math.round(n * 100);
}
