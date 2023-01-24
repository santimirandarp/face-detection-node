import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * Saves a file to the given absolute path
 * @param newFilePath - absolute path to save the file to
 * @param addPreFileName - optional string to add to the beginning of the file name
 * @param buf - the buffer to save
 */
export function saveImage(buf: Buffer, newPath: string) {
  const newDir = path.dirname(newPath);
  if (!existsSync(newDir)) {
    mkdirSync(newDir, { recursive: true });
  }
  writeFileSync(newPath, buf);
  console.log(`done, saved detected results to ${newPath}`);
}
