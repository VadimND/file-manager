import path from "path";
import fs from "fs";
import { resolveFilePath, directoryExists } from "../messages.js";

const navigateUp = () => {
  const currentDir = process.cwd();
  const parentDir = path.dirname(currentDir);

  if (parentDir === currentDir) {
    return;
  }

  process.chdir(parentDir);
};

const changeDirectory = (targetPath) => {
  try {
    const newPath = resolveFilePath(targetPath);

    if (!directoryExists(newPath)) {
      throw new Error("Directory does not exist");
    }

    process.chdir(newPath);
  } catch (error) {
    throw new Error("Invalid directory");
  }
};

const listDirectoryContents = async () => {
  try {
    const directoryPath = process.cwd();

    const entries = await fs.promises.readdir(directoryPath, {
      withFileTypes: true,
    });

    const detailedInfo = [];

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);
      const stats = await fs.promises.lstat(fullPath);

      detailedInfo.push({
        Name: entry.name,
        Type: entry.isDirectory() ? "directory" : "file",
        Size: `${stats.size} B`,
        Modified: stats.mtime.toLocaleString(),
      });
    }

    detailedInfo.sort((a, b) => {
      if (a.Type !== b.Type) {
        return a.Type === "directory" ? -1 : 1;
      }
      return a.Name.localeCompare(b.Name);
    });

    console.table(detailedInfo);
  } catch (error) {
    throw new Error("Failed to list directory contents");
  }
};

export { navigateUp, changeDirectory, listDirectoryContents };
