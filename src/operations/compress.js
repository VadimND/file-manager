import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { resolveFilePath, fileExists } from "../messages.js";

const compressFile = async (sourcePath, destPath) => {
  try {
    const resolvedSourcePath = resolveFilePath(sourcePath);
    const resolvedDestPath = resolveFilePath(destPath);

    if (!fileExists(resolvedSourcePath)) {
      throw new Error("Source file does not exist");
    }

    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(resolvedDestPath);
    const brotliCompress = createBrotliCompress();

    await pipeline(readStream, brotliCompress, writeStream);
  } catch (error) {
    throw new Error("Failed to compress file");
  }
};

const decompressFile = async (sourcePath, destPath) => {
  try {
    const resolvedSourcePath = resolveFilePath(sourcePath);
    const resolvedDestPath = resolveFilePath(destPath);

    if (!fileExists(resolvedSourcePath)) {
      throw new Error("Source file does not exist");
    }

    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(resolvedDestPath);
    const brotliDecompress = createBrotliDecompress();

    await pipeline(readStream, brotliDecompress, writeStream);
  } catch (error) {
    throw new Error("Failed to decompress file");
  }
};

export { compressFile, decompressFile };
