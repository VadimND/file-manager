import fs, { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import path from "path";
import { resolveFilePath, fileExists, directoryExists } from "../messages.js";

const createEmptyFile = async (fileName) => {
  try {
    const filePath = path.join(process.cwd(), fileName);
    
    if (fs.existsSync(filePath)) {
      throw new Error("File already exists");
    }

    await fs.promises.writeFile(filePath, "");
  } catch (error) {
    throw new Error("Failed to create file");
  }
};

const createDirectory = async (dirName) => {
  try {
    const dirPath = path.join(process.cwd(), dirName);

    if (fs.existsSync(dirPath)) {
      throw new Error("Directory already exists");
    }

    await fs.promises.mkdir(dirPath);
  } catch (error) {
    throw new Error("Failed to create directory");
  }
};

const readFile = async (filePath) => {
  try {
    const resolvedPath = resolveFilePath(filePath);
    if (!fileExists(resolvedPath)) {
      throw new Error("File does not exist");
    }

    const readStream = createReadStream(resolvedPath);
    readStream.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    return new Promise((resolve, reject) => {
      readStream.on("end", () => {
        console.log(); 
        resolve();
      });

      readStream.on("error", reject);
    });
  } catch (error) {
    throw new Error("Failed to read file");
  }
};

const renameFile = async (oldPath, newFilename) => {
  try {
    const sourcePath = resolveFilePath(oldPath);

    if (!fileExists(sourcePath)) {
      throw new Error("Source file does not exist");
    }

    const dirPath = path.dirname(sourcePath);
    const destPath = path.join(dirPath, newFilename);

    if (fs.existsSync(destPath)) {
      throw new Error("Destination file already exists");
    }

    await fs.promises.rename(sourcePath, destPath);
  } catch (error) {
    throw new Error("Failed to rename file");
  }
};

const copyFile = async (sourcePath, destDirPath) => {
  try {
    const resolvedSourcePath = resolveFilePath(sourcePath);
    const resolvedDestDir = resolveFilePath(destDirPath);

    if (!fileExists(resolvedSourcePath)) {
      throw new Error("Source file does not exist");
    }

    if (!directoryExists(resolvedDestDir)) {
      throw new Error("Destination directory does not exist");
    }

    const fileName = path.basename(resolvedSourcePath);
    const destPath = path.join(resolvedDestDir, fileName);

    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(destPath);

    await pipeline(readStream, writeStream);
  } catch (error) {
    throw new Error("Failed to copy file");
  }
};

const moveFile = async (sourcePath, destDirPath) => {
  try {
    await copyFile(sourcePath, destDirPath);

    await deleteFile(sourcePath);
  } catch (error) {
    throw new Error("Failed to move file");
  }
};

const deleteFile = async (filePath) => {
  try {
    const resolvedPath = resolveFilePath(filePath);

    if (!fileExists(resolvedPath)) {
      throw new Error("File does not exist");
    }

    await fs.promises.unlink(resolvedPath);
  } catch (error) {
    throw new Error("Failed to delete file");
  }
};

export {
  readFile,
  createEmptyFile,
  createDirectory,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
};
