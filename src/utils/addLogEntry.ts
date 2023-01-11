import type { Logs } from "../types";
export function addLogEntry(logs: Logs, filename: string, error: Error): void {
  logs.filename.push(filename);
  logs.error.push(`${error}`);
  logs.total += 1;
}
