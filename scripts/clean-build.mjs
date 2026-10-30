import { rm } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const generatedDirectories = [
  path.join(projectRoot, "dist"),
  path.join(projectRoot, ".vercel", "output")
];

for (const directory of generatedDirectories) {
  await rm(directory, { recursive: true, force: true });
}
