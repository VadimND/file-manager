import path from "path";
import fs from "fs";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const username =
    args.find((arg) => arg.startsWith("--username="))?.split("=")[1] || "Admin";

  return { username };
};

const resolveFilePath = (inputPath) => {
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.join(process.cwd(), inputPath);
};

const fileExists = (filePath) => {
  const resolvedPath = resolveFilePath(filePath);
  return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile();
};

const directoryExists = (dirPath) => {
  const resolvedPath = resolveFilePath(dirPath);
  return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory();
};

const printCurDir = () => {
  console.log(`\nYou are currently in: ${process.cwd()}`);
};

const parseCommandWithQuotes = (input) => {
  const result = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if ((char === '"' || char === "'") && (i === 0 || input[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = "";
      } else {
        current += char;
      }

      continue;
    }

    if (char === " " && !inQuotes) {
      if (current) {
        result.push(current);
        current = "";
      }

      continue;
    }

    current += char;
  }

  if (current) {
    result.push(current);
  }

  return result;
};

export {
  parseArgs,
  resolveFilePath,
  fileExists,
  directoryExists,
  printCurDir,
  parseCommandWithQuotes,
};
