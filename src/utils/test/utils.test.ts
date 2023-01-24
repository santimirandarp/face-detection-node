import { describe, it, expect } from "vitest";
import { SsdMobilenetv1Options } from "../..";

import {
  addLogEntry,
  renameFile,
  mergeConfigModel,
  mergeConfigPath,
  score,
} from "..";

describe("test utils", () => {
  it("add log entry", () => {
    const logs = {
      filename: [],
      error: [],
      total: 0,
    };
    addLogEntry(logs, "test.jpg", new Error("test error"));
    expect(logs).toMatchObject({
      filename: ["test.jpg"],
      error: ["Error: test error"],
      total: 1,
    });
    addLogEntry(logs, "test.jpg", new Error("test error"));
    expect(Object.keys(logs)).toHaveLength(3);
    expect(logs.filename).toHaveLength(2);
  });
  it("rename file", () => {
    const filename = "wikimed.jpeg";
    const result = renameFile(__dirname, "annotation", filename);
    expect(result).toEqual(`${__dirname}/annotation/wikimed.jpeg`);
  });
  it("configure detector", () => {
    const paths = mergeConfigPath({
      root: "/hello/world",
      imgDirOrFile: "images",
      confirmPaths: true,
    });
    expect(paths).toMatchObject({
      root: "/hello/world",
      imgDirOrFile: "/hello/world/images",
      modelsDir: "/hello/models",
      outDir: "/hello/world/out",
      confirmPaths: true,
      ignore: expect.any(Function),
    });
    const model = mergeConfigModel({
      detectionOptions: new SsdMobilenetv1Options({
        minConfidence: 0.5,
        maxResults: 1,
      }),
      annotations: [score],
    });
    expect(model).toMatchObject({
      singleFace: false,
      detectionOptions: new SsdMobilenetv1Options({
        minConfidence: 0.5,
        maxResults: 1,
      }),
      annotations: [score],
    });
  });
});
