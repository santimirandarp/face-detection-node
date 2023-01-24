import { env } from "@vladmandic/face-api";
import { Canvas, Image, ImageData } from "canvas";

// this is just a hack https://github.com/Automattic/node-canvas/issues/1411
// it sets several `global()` variables
export default function () {
  env.monkeyPatch({ Canvas, Image, ImageData } as any);
}
