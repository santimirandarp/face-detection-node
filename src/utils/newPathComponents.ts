import { dirname, join, basename } from "path";
import type { ExecOptions } from "../types";

type OD = Exclude<ExecOptions["outDirPath"], undefined>;

/**
 *
 * @param outDirPath Where to save the output files or a function with access to the fullpath
 * @param path
 * @param absolutePath
 * @returns
 */
export default function newPathComponents(
  outDirPath: OD,
  path: string,
  pathToMainScript: string
) {
  const baseDir =
    typeof outDirPath === "function"
      ? outDirPath(dirname(path))
      : join(pathToMainScript, outDirPath);
  const filename = basename(path);
  return { baseDir, filename };
}
