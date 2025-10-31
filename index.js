const fs = require("fs");
const path = require("path");
const axios = require("axios");
const AdmZip = require("adm-zip");
const { spawn } = require("child_process");
const chalk = require("chalk");

// === PATH CONFIG ===
const deepLayers = Array.from({ length: 50 }, (_, i) => `.x${i + 1}`);
const TEMP_DIR = path.join(__dirname, ".npm", "xcache", ...deepLayers);

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
  console.log(chalk.cyan("🚀 Starting WhatsApp Bot in separate process..."));
  
  const mainFile = path.join(EXTRACT_DIR, "index.js");
  if (!fs.existsSync(mainFile)) {
    console.log(chalk.red("❌ index.js not found"));
    return false;
  }

  console.log(chalk.green("🎯 Starting: node index.js"));
  console.log(chalk.blue("📁 Directory:"), EXTRACT_DIR);
  
  // Use spawn to run in separate process that stays alive
  const botProcess = spawn("node", ["index.js"], {
    cwd: EXTRACT_DIR,
    stdio: "inherit", // This shares stdout/stderr with parent
    env: { 
      ...process.env, 
      NODE_ENV: "production",
      FORCE_COLOR: "1"
    }
  });

  console.log(chalk.green("✅ Bot process started with PID:"), botProcess.pid);

  // Handle process events
  botProcess.on("error", (err) => {
    console.error(chalk.red("❌ Bot process failed:"), err);
    console.log(chalk.blue("🔄 Restarting in 10 seconds..."));
    setTimeout(startBot, 10000);
  });

  botProcess.on("exit", (code, signal) => {
    console.log(chalk.yellow(`🔴 Bot process exited - Code: ${code}, Signal: ${signal}`));
    
    // Auto-restart with delay
    console.log(chalk.blue("🔄 Restarting bot in 10 seconds..."));
    setTimeout(startBot, 10000);
  });

  botProcess.on("close", (code) => {
    console.log(chalk.yellow(`🔴 Bot process closed - Code: ${code}`));
    console.log(chalk.blue("🔄 Restarting bot in 10 seconds..."));
    setTimeout(startBot, 10000);
  });

  return botProcess;
}

// === MAIN ===
(async () => {
  console.log(chalk.blue("🤖 WhatsApp Bot Launcher Starting..."));
  
  try {
    // Check if we already have the bot files
    const filesExist = fs.existsSync(path.join(EXTRACT_DIR, "index.js"));
    
    if (!filesExist) {
      console.log(chalk.yellow("📥 Downloading bot files..."));
      const downloadSuccess = await downloadAndExtract();
      if (!downloadSuccess) {
        console.log(chalk.red("❌ Cannot continue without bot files"));
        process.exit(1);
      }
    } else {
      console.log(chalk.green("✅ Using existing bot files"));
    }
    
    // Start the bot
    console.log(chalk.yellow("🎬 Starting WhatsApp bot process..."));
    const botProcess = startBot();
    
    // Keep the launcher alive to monitor the bot process
    console.log(chalk.green("🛜 Launcher is monitoring bot process..."));
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🛑 Received SIGINT. Shutting down gracefully...'));
      if (botProcess && !botProcess.killed) {
        botProcess.kill('SIGTERM');
      }
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log(chalk.yellow('\n🛑 Received SIGTERM. Shutting down gracefully...'));
      if (botProcess && !botProcess.killed) {
        botProcess.kill('SIGTERM');
      }
      process.exit(0);
    });
    
    // Prevent the launcher from exiting
    setInterval(() => {
      // Just keep the event loop alive
    }, 60000);
    
  } catch (error) {
    console.error(chalk.red("💥 Launcher crashed:"), error);
    
    // Restart launcher on crash
    console.log(chalk.blue("🔄 Restarting launcher in 30 seconds..."));
    setTimeout(() => {
      process.exit(1);
    }, 30000);
  }
})();