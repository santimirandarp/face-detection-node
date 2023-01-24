import * as readline from "readline-sync";
import { type FaceDetectorNode } from "../FaceDetectorNode";

export function confirmPathOnce(this: FaceDetectorNode) {
  const answer = readline.question(
    `Current paths:
    - ${this.configPath.root}  =  base dir, 
    - ${this.configPath.imgDirOrFile}  =  inputs,
    - ${this.configPath.outDir}  =  output base directory. 
      Press Y/y to continue or N/n to cancel: `
  );
  if (/^Y$/i.test(answer)) {
    console.log("Now running...");
  } else {
    console.log("Exiting...");
    process.exit(1);
  }
}
