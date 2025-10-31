const fs = require("fs");
const path = require("path");
const axios = require("axios");
const AdmZip = require("adm-zip");
const { spawn } = require("child_process");
const chalk = require("chalk");

// === PATH CONFIG ===
const TEMP_DIR = path.join(__dirname, ".npm", "xcache");

// === GIT CONFIG ===
const REPO_OWNER = "private-254";
const REPO_NAME = "private";
const BRANCH = "main";
const DOWNLOAD_URL = `https://codeload.github.com/${REPO_OWNER}/${REPO_NAME}/zip/refs/heads/${BRANCH}`;

const EXTRACT_DIR = path.join(TEMP_DIR, `${REPO_NAME}-${BRANCH}`);
const ZIP_PATH = path.join(TEMP_DIR, "repo.zip");

// === DOWNLOAD & EXTRACT ===
async function downloadAndExtract() {
  try {
    console.log(chalk.yellow("📥 Downloading bot from GitHub..."));
    
    const response = await axios({
      url: DOWNLOAD_URL,
      method: "GET",
      responseType: "stream",
      timeout: 60000
    });

    fs.mkdirSync(TEMP_DIR, { recursive: true });
    const writer = fs.createWriteStream(ZIP_PATH);
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(chalk.cyan("📤 Extracting files..."));
    if (fs.existsSync(EXTRACT_DIR)) {
      fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
    }
    
    const zip = new AdmZip(ZIP_PATH);
    zip.extractAllTo(TEMP_DIR, true);

    // Clean up zip file
    if (fs.existsSync(ZIP_PATH)) {
      fs.unlinkSync(ZIP_PATH);
    }

    console.log(chalk.green("✅ Download completed!"));
    return true;

  } catch (e) {
    console.error(chalk.red("❌ Download failed:"), e.message);
    return false;
  }
}

function startBot() {
  console.log(chalk.cyan("🚀 Starting WhatsApp Bot..."));
  
  const mainFile = path.join(EXTRACT_DIR, "index.js");
  if (!fs.existsSync(mainFile)) {
    console.log(chalk.red("❌ index.js not found"));
    return false;
  }

  console.log(chalk.green("🎯 Starting: node index.js"));
  console.log(chalk.blue("📁 Directory:"), EXTRACT_DIR);
  
  // Start bot with explicit session handling
  const botProcess = spawn("node", ["index.js"], {
    cwd: EXTRACT_DIR,
    stdio: "inherit",
    env: { 
      ...process.env, 
      NODE_ENV: "production",
      FORCE_COLOR: "1"
    }
  });

  console.log(chalk.green("✅ Bot process started with PID:"), botProcess.pid);

  botProcess.on("error", (err) => {
    console.error(chalk.red("❌ Bot process failed:"), err);
    console.log(chalk.blue("🔄 Restarting in 10 seconds..."));
    setTimeout(startBot, 10000);
  });

  botProcess.on("exit", (code, signal) => {
    console.log(chalk.yellow(`🔴 Bot process exited - Code: ${code}, Signal: ${signal}`));
    console.log(chalk.blue("🔄 Restarting bot in 10 seconds..."));
    setTimeout(startBot, 10000);
  });

  return botProcess;
}

// === MAIN ===
(async () => {
  console.log(chalk.blue("🤖 WhatsApp Bot Launcher Starting..."));
  
  try {
    // Always download fresh files to ensure latest version
    console.log(chalk.yellow("📥 Downloading latest bot files..."));
    const downloadSuccess = await downloadAndExtract();
    if (!downloadSuccess) {
      console.log(chalk.red("❌ Cannot continue without bot files"));
      process.exit(1);
    }
    
    // Start the bot
    console.log(chalk.yellow("🎬 Starting WhatsApp bot..."));
    startBot();
    
    // Keep launcher alive
    console.log(chalk.green("🛜 Launcher monitoring bot process..."));
    
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Shutting down...'));
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log(chalk.yellow('\n🛑 Shutting down...'));
      process.exit(0);
    });
    
  } catch (error) {
  console.error(chalk.red("💥 Launcher crashed:"), error);

  // Attempt automatic restart after 10 seconds instead of killing the process
  setTimeout(() => {
    console.log(chalk.yellow("🔁 Attempting to restart bot after crash..."));
    try {
      startBot(); // restart function (same one used above)
      console.log(chalk.green("✅ Bot restarted successfully!"));
    } catch (restartError) {
      console.error(chalk.red("❌ Failed to restart bot:"), restartError);
    }
  }, 10000);
}
})();