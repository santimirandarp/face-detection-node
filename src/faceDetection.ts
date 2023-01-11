import readdir from "recursive-readdir";
import { readFile } from "node:fs/promises";
import { join } from "path";
import { lookup } from "mime-types";
import { SsdMobilenetv1Options } from "@vladmandic/face-api";
import * as canvas from "canvas";

import {
  loadNNFromOptions,
  newPathComponents,
  saveImage,
  saveStats,
  addLogEntry,
  formatScore,
} from "./utils/index";
import faceapiCanvasPatch from "./patch/canvas";
import type { ExecOptions, Logs } from "./types";
import { score, mask } from "./utils/annotateImage";
import { singleDetection, multiDetection } from "./detectors/index";

/**
 * Recursively grabs all images starting at "imgDir"
 * @param mainScriptFullPath - absolute path to your current file. (__dirname for example)
 * @param imgDir start-directory for reading recursively. If `options.singleFile` is set `true`
 * it will interpret this as a file path.
 * @param modelsDir Where the models/NNs are stored
 * @param options { @link types#ExecOptions }
 */
export async function faceDetection(
  mainScriptFullPath: string,
  imgDir = "../images/",
  modelsDir = "./models",
  options: Partial<ExecOptions> = {}
): Promise<void> {
  faceapiCanvasPatch();

  //defaults
  const {
    outStatsPath = undefined,
    outDirPath = "./out",
    singleFace = false,
    annotations = [score, mask],
    pathFilter = (filePath: string) => filePath.endsWith(".jpg"),
    detectionOptions = new SsdMobilenetv1Options({
      minConfidence: 0.36,
      maxResults: 2,
    }),
    singleFile = false,
  } = options;

  const logs: Logs = {
    filename: [],
    error: [],
    total: 0,
  };

  imgDir = join(mainScriptFullPath, imgDir);
  modelsDir = join(mainScriptFullPath, modelsDir);

  // load the nn
  await loadNNFromOptions(detectionOptions, modelsDir);

  const paths = singleFile ? [imgDir] : await readdir(imgDir);
  for (const path of paths) {
    if (!pathFilter(path)) continue;

    const { baseDir, filename } = newPathComponents(
      outDirPath,
      path,
      mainScriptFullPath
    );
    const mime = lookup(filename);
    try {
      const buffer = await readFile(path);
      const img = await canvas.loadImage(buffer);
      const result = singleFace
        ? await singleDetection(img, detectionOptions)
        : await multiDetection(img, detectionOptions);

      if (result !== null) {
        const [img, detection] = result;
        const scoreText = formatScore(detection);

        for (const annotate of annotations) {
          const nf = Array.isArray(detection) ? detection.length : 1;
          try {
            saveImage(
              annotate(img as any, detection).toBuffer(mime),
              join(baseDir, `${nf}_${annotate.name}`, `${scoreText}${filename}`)
            );
          } catch (e) {
            throw new Error(
              `There was an error saving the image files\n ${e})`
            );
          }
        }
      } else {
        saveImage(buffer, join(baseDir, "noface", filename));
      }
    } catch (e) {
      if (e instanceof Error) addLogEntry(logs, filename, e);
    }
  }
  // to know what was or wasn't processed
  if (outStatsPath) {
    const statsPath = join(mainScriptFullPath, outStatsPath);
    saveStats(statsPath, logs);
  }
  return;
}
