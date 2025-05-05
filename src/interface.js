import readline from "readline";
import { printCurDir, parseCommandWithQuotes } from "./messages.js";
import { compressFile, decompressFile } from "./operations/compress.js";
import { calculateHash } from "./operations/hash.js";
import { getOSInfo } from "./operations/os.js";
import { showManual } from "./operations/help.js";
import {
  navigateUp,
  changeDirectory,
  listDirectoryContents,
} from "./operations/menu.js";
import {
  readFile,
  createEmptyFile,
  createDirectory,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
} from "./operations/fs.js";

const setupCLI = (username) => {
  const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  cliInterface.on("SIGINT", () => {
    exitHandler(username, cliInterface);
  });

  process.stdin.setRawMode(true);

  process.stdin.on("data", (key) => {
    if (key.toString() === "\x0c") { 
      console.clear();
      showPrompt(cliInterface);
    }
  });

  cliInterface.on("line", async (input) => {
    try {
      if (input.trim() === ".exit") {
        exitHandler(username, cliInterface);
        return;
      }

      await processCommand(input.trim());

    } catch (error) {
      console.error(`"Operation failed": ${error.message}`);
    }

    showPrompt(cliInterface);
  });

  cliInterface.prompt();
};

const exitHandler = (username, cliInterface) => {
  console.log(
    `Thank you for using File Manager, ${username}, goodbye!`
  );
  cliInterface.close();
  process.exit(0);
};

const showPrompt = (cliInterface) => { 
  printCurDir();
  cliInterface.prompt();
};

const processCommand = async (input) => {
  const args = parseCommandWithQuotes(input);

  if (args.length === 0) {
    throw new Error("Empty command");
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    switch (command) {
      case "up":
        navigateUp();
        break;

      case "cd":
        if (!commandArgs[0]) throw new Error("Missing path argument");
        changeDirectory(commandArgs[0]);
        break;

      case "ls":
        await listDirectoryContents();
        break;

      case "cat":
        if (!commandArgs[0]) throw new Error("Missing file path");
        await readFile(commandArgs[0]);
        break;

      case "add":
        if (!commandArgs[0]) throw new Error("Missing file name");
        await createEmptyFile(commandArgs[0]);
        break;

      case "mkdir":
        if (!commandArgs[0]) throw new Error("Missing directory name");
        await createDirectory(commandArgs[0]);
        break;

      case "rn":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await renameFile(commandArgs[0], commandArgs[1]);
        break;

      case "cp":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await copyFile(commandArgs[0], commandArgs[1]);
        break;

      case "mv":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await moveFile(commandArgs[0], commandArgs[1]);
        break;

      case "rm":
        if (!commandArgs[0]) throw new Error("Missing file path");

        await deleteFile(commandArgs[0]);
        break;

      case "os":
        if (!commandArgs[0]) throw new Error("Missing OS info parameter");

        await getOSInfo(commandArgs[0]);
        break;

      case "hash":
        if (!commandArgs[0]) throw new Error("Missing file path");

        await calculateHash(commandArgs[0]);
        break;

      case "compress":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await compressFile(commandArgs[0], commandArgs[1]);
        break;

      case "decompress":
        if (!commandArgs[0] || !commandArgs[1])
          throw new Error("Missing arguments");

        await decompressFile(commandArgs[0], commandArgs[1]);
        break;

      case "help":
        showManual(commandArgs[0]);
        break;

      case "clear":
        console.clear();
        break;

      default:
        console.error("Invalid input");
    }
  } catch (error) {
    console.error(`Operation failed for command: '${input}'`);

    if (error.message) {
      console.error(`Error: ${error.message}`);
    }
  }
};

export { setupCLI };
