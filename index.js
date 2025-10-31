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

// === DEBUG FUNCTIONS ===
function debugFiles() {
  console.log(chalk.yellow("🔍 DEBUG - Checking extracted files..."));
  
  if (!fs.existsSync(EXTRACT_DIR)) {
    console.log(chalk.red("❌ Extracted directory doesn't exist!"));
    return;
  }
  
  const files = fs.readdirSync(EXTRACT_DIR);
  console.log(chalk.blue("📁 Files in extracted directory:"), files);
  
  // Check for index.js specifically
  const indexPath = path.join(EXTRACT_DIR, "index.js");
  if (fs.existsSync(indexPath)) {
    console.log(chalk.green("✅ index.js found!"));
    // Read first few lines to verify it's your bot
    const content = fs.readFileSync(indexPath, 'utf8').substring(0, 200);
    console.log(chalk.blue("📄 First 200 chars of index.js:"), content);
  } else {
    console.log(chalk.red("❌ index.js NOT found in extracted directory!"));
  }
}

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
    
    // Debug: Show what was extracted
    debugFiles();
    
    return true;

  } catch (e) {
    console.error(chalk.red("❌ Download failed:"), e.message);
    return false;
  }
}

function startBot() {
  console.log(chalk.cyan("🚀 Attempting to start bot..."));
  
  // Verify everything first
  if (!fs.existsSync(EXTRACT_DIR)) {
    console.log(chalk.red("❌ Extracted directory not found at:"), EXTRACT_DIR);
    return false;
  }

  const mainFile = path.join(EXTRACT_DIR, "index.js");
  if (!fs.existsSync(mainFile)) {
    console.log(chalk.red("❌ index.js not found at:"), mainFile);
    console.log(chalk.yellow("📁 Available files:"), fs.readdirSync(EXTRACT_DIR));
    return false;
  }

  console.log(chalk.green("🎯 Starting YOUR bot from repository..."));
  console.log(chalk.blue("📍 File:"), mainFile);
  console.log(chalk.blue("📁 Directory:"), EXTRACT_DIR);

  try {
    // Clear any require cache for the bot files
    Object.keys(require.cache).forEach(key => {
      if (key.startsWith(EXTRACT_DIR)) {
        delete require.cache[key];
      }
    });

    // Change to the bot directory and require the bot
    process.chdir(EXTRACT_DIR);
    console.log(chalk.green("🔄 Changed working directory to:"), process.cwd());
    
    // Import and run the bot
    console.log(chalk.yellow("⏳ Loading your bot..."));
    const bot = require(mainFile);
    console.log(chalk.green("✅ Your bot loaded successfully!"));
    
    return true;

  } catch (error) {
    console.error(chalk.red("❌ Failed to start your bot:"), error);
    
    // Try alternative method - spawn process
    console.log(chalk.yellow("🔄 Trying alternative startup method..."));
    try {
      const botProcess = spawn("node", ["index.js"], {
        cwd: EXTRACT_DIR,
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "production" }
      });

      botProcess.on("error", (err) => {
        console.error(chalk.red("❌ Bot process failed:"), err);
      });

      botProcess.on("exit", (code) => {
        console.log(chalk.yellow(`🔴 Bot process exited with code: ${code}`));
      });

      return true;
    } catch (spawnError) {
      console.error(chalk.red("❌ Both startup methods failed:"), spawnError);
      return false;
    }
  }
}

// === MAIN ===
(async () => {
  console.log(chalk.blue("🤖 Bot Launcher Starting..."));
  console.log(chalk.blue("📦 Target Repository:"), `${REPO_OWNER}/${REPO_NAME}`);
  
  try {
    // Download the bot
    const downloadSuccess = await downloadAndExtract();
    if (!downloadSuccess) {
      console.log(chalk.red("❌ Cannot continue without bot files"));
      process.exit(1);
    }
    
    // Start the bot
    console.log(chalk.yellow("🎬 Starting the actual bot from repository..."));
    const startSuccess = startBot();
    
    if (!startSuccess) {
      console.log(chalk.red("❌ Failed to start bot"));
      process.exit(1);
    }
    
    console.log(chalk.green("🎉 Bot launcher completed - your bot should be running!"));
    
  } catch (error) {
    console.error(chalk.red("💥 Launcher crashed:"), error);
    process.exit(1);
  }
})();