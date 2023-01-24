import { isAbsolute, join } from "node:path";
import { SsdMobilenetv1Options } from "@vladmandic/face-api";
import type { ConfigPaths, ConfigModel } from "../types";
import { score, mask } from "./annotations";

export function mergeConfigPath(user: ConfigPaths): Required<ConfigPaths> {
  // check if the main path is absolute
  if (!isAbsolute(user.root)) {
    throw new Error(
      `absPathToDir must be an absolute path. Received: ${user.root}`
    );
  }

  const defaults: Required<Omit<ConfigPaths, "root">> = {
    imgDirOrFile: "../images",
    modelsDir: "../models",
    outDir: "./out",
    confirmPaths: true,
    ignore: (path: string) => !path.endsWith(".jpg"),
  };
  const root = user.root;
  const merged = { ...defaults, ...user };
  merged.imgDirOrFile = join(root, merged.imgDirOrFile);
  merged.modelsDir = join(root, merged.modelsDir);
  merged.outDir = join(root, merged.outDir);
  return merged;
}

export function mergeConfigModel(user: ConfigModel): Required<ConfigModel> {
  // settings for the model
  const defaults = {
    singleFace: false,
    annotations: [score, mask],
    detectionOptions: new SsdMobilenetv1Options({
      minConfidence: 0.36,
      maxResults: 2,
    }),
  };
  return { ...defaults, ...user };
}
