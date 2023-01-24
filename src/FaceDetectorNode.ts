import { writeFileSync, lstatSync } from "node:fs";
import { join } from "node:path";
import readdir from "recursive-readdir";
import {
  TinyFaceDetectorOptions,
  SsdMobilenetv1Options,
} from "@vladmandic/face-api";
import {
  loadNNFromOptions,
  confirmPathOnce,
  detectOne,
  detectAll,
} from "./methods";
import { mergeConfigModel, mergeConfigPath } from "./utils";
import faceapiCanvasPatch from "./patch/canvas";
import type { ConfigPaths, ConfigModel, Logs, RelativePath } from "./types";

class FaceDetectorNode {
  configPath: Required<ConfigPaths>;
  inputs: Promise<string[]>;
  model: Required<ConfigModel>;
  logs: Logs;
  offset: number;
  isNNLoaded: boolean;
  constructor(configPaths: ConfigPaths, configModel: ConfigModel) {
    faceapiCanvasPatch();

    this.configPath = mergeConfigPath(configPaths);
    this.logs = { filename: [], error: [], total: 0 };
    // start async-loading as soon as the class is instantiated;
    this.model = mergeConfigModel(configModel);
    this.inputs = this.#setInput();
    this.offset = 0;
    this.isNNLoaded = false;
  }
  detectAll = detectAll;
  // prompt user to confirm all base paths that will be used.
  detectOne = detectOne;
  confirmPathOnce = confirmPathOnce;
  loadNN = loadNNFromOptions;

  /**
   * option to save the logs to a file
   * @param fromRoot - is a relative path from the root path
   */
  saveStats(fromRoot: RelativePath) {
    const stats = join(this.configPath.root, fromRoot);
    try {
      writeFileSync(stats, JSON.stringify(this.logs, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
  async #setInput() {
    const dir = this.configPath.imgDirOrFile;
    if (lstatSync(dir).isFile()) {
      return [dir];
    } else if (this.configPath.ignore) {
      return await readdir(dir, [this.configPath.ignore]);
    } else {
      return await readdir(dir);
    }
  }
}
export { FaceDetectorNode, TinyFaceDetectorOptions, SsdMobilenetv1Options };
