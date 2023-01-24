import { readFileSync } from "node:fs";

import { lookup } from "mime-types";
import { saveImage, addLogEntry, renameFile } from "../utils";
import { type FaceDetectorNode } from "../FaceDetectorNode";
import type { Detections } from "../types";

export async function detectAll(
  this: FaceDetectorNode,
  annotateAndSave = false
) {
  const inputs = await this.inputs;
  if (inputs.length === 0) {
    throw new Error(`
    No files found in ${this.configPath.imgDirOrFile}, 
    after applying the ignore function.  
    To skip the ignore function, set it to "ignore: () => false"`);
  }
  if (this.isNNLoaded === false) {
    throw new Error("Neural network not loaded, call Instance.loadNN() first");
  }
  const results: Detections[] = [];
  this.configPath.confirmPaths && this.confirmPathOnce();
  for (const url of inputs) {
    const filename = url.split("/").pop();
    if (!filename) {
      throw new Error(`Error parsing filename for ${url}`);
    }
    try {
      const outputs = []; //for the output filename
      const buffer = readFileSync(url);
      this.offset++;
      const mime = lookup(filename);
      const { canvasImage, detection } = await this.detectOne(buffer);
      if (annotateAndSave) {
        if (!detection) {
          const output = renameFile(
            this.configPath.outDir,
            "no_face",
            filename
          );
          saveImage((canvasImage as any).toBuffer(mime), output);
          outputs.push(output);
        } else {
          for (const annotate of this.model.annotations) {
            const output = renameFile(
              this.configPath.outDir,
              annotate.name,
              filename,
              detection
            );
            const annotation = annotate(canvasImage as any, detection);
            saveImage(annotation.toBuffer(mime), output);
            outputs.push(output);
          }
        }
      }
      results.push({ input: url, detection, outputs });
    } catch (e) {
      if (e instanceof Error) addLogEntry(this.logs, filename, e);
    }
  }
  return results;
}
