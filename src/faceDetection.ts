import { readFile } from "node:fs/promises";
import { join } from "path";
import readdir from "recursive-readdir";
import { lookup } from "mime-types";
// just a namespace import, they export all functions
import { SsdMobilenetv1Options } from "@vladmandic/face-api";
import * as canvas from "canvas";

import loadNNFromOptions from "./utils/loadNNFromOptions";
import faceapiCanvasPatch from "./patch/canvas";
import formatScore from "./utils/formatScore";
import newPathComponents from "./utils/newPathComponents";
import type { ExecOptions, Logs } from "./types";
import { score, mask } from "./utils/annotateImage";
import { singleDetection, multiDetection } from "./helpers/detections";
import { saveImage, saveStats } from "./utils/saveFile";

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
    filename: new Array<string>(),
    error: new Array<string>(),
    total: 0,
  };

  imgDir = join(mainScriptFullPath, imgDir);
  modelsDir = join(mainScriptFullPath, modelsDir);
  // load the nn and options to faceapi object
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
      logs.filename.push(filename);
      logs.error.push(`${e}`);
      logs.total += 1;
    }
  }
  // to know what was or wasn't processed
  if (outStatsPath) {
    const statsPath = join(mainScriptFullPath, outStatsPath);
    saveStats(statsPath, logs);
  }
  return;
}
