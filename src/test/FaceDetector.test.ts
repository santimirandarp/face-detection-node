import { describe, expect, it } from "vitest";
import type { ConfigPaths, ConfigModel } from "../types";
import {
  FaceDetectorNode,
  SsdMobilenetv1Options,
  TinyFaceDetectorOptions,
} from "..";

describe("Detect many things", () => {
  const paths: ConfigPaths = {
    root: __dirname, //resolves from here
    imgDirOrFile: "./in/wikimedia.jpeg",
    modelsDir: "../../models",
    outDir: "./new/images/ssd1_multiface/",
    ignore: (file) => !/\.jpeg$/i.test(file),
    confirmPaths: false,
  };

  const modelConfig: ConfigModel = {
    singleFace: true,
    // the tiny face detector detects 5/6 in this image
    detectionOptions: new SsdMobilenetv1Options({
      minConfidence: 0.4,
      maxResults: 8,
    }),
  };

  const detector = new FaceDetectorNode(paths, modelConfig);
  it("number of faces in a file", async () => {
    await detector.loadNN();
    const result = await detector.detectAll();
    expect(result[0].outputs).toHaveLength(0);
    expect(result).toHaveLength(1);
  });
  it("configPath", () => {
    expect(detector.configPath).toMatchObject({
      root: __dirname,
      imgDirOrFile: expect.stringContaining("/test/in/"),
      outDir: expect.stringContaining("/new/images/ssd1_multiface/"),
      modelsDir: expect.stringContaining("/models"),
      ignore: expect.any(Function),
      confirmPaths: false,
    });
  });
  it("analyze directory and store data wo prompt", async () => {
    const paths: ConfigPaths = {
      root: __dirname, //resolves from here
      imgDirOrFile: "./in/",
      modelsDir: "../../models",
      outDir: "./new/images/tinid_singleface/",
      ignore: (file) => !/.jpg$|\.jpeg$/i.test(file),
      confirmPaths: false,
    };

    const modelConfig: ConfigModel = {
      singleFace: false,
      // the tiny face detector detects 5/6 in this image
      detectionOptions: new TinyFaceDetectorOptions({
        scoreThreshold: 0.2,
      }),
    };
    const detector2 = new FaceDetectorNode(paths, modelConfig);
    await detector2.loadNN();
    const result = await detector2.detectAll(true);
    const nOfImages = 2;
    // detects 5/6
    expect(result[0].detection).toHaveLength(3);
    expect(result[1].detection).toHaveLength(5);
    expect(result).toHaveLength(nOfImages);
    return;
  });
});
