import os from "os";
import { parseArgs, printCurDir } from "./src/messages.js";
import { setupCLI } from "./src/interface.js";

// Start File Manager
const initFileManager = () => {
  const { username } = parseArgs();
  process.chdir(os.homedir());

  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(`Type "help" to view all commands.`);
  printCurDir();

  setupCLI(username);
};

initFileManager();