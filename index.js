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
// Alternative download URL without the "archive" format
const DOWNLOAD_URL = `https://codeload.github.com/${REPO_OWNER}/${REPO_NAME}/zip/refs/heads/${BRANCH}`;

// Fixed path configurations
const EXTRACT_DIR = path.join(TEMP_DIR, `${REPO_NAME}-${BRANCH}`);
const ZIP_PATH = path.join(TEMP_DIR, "repo.zip");
const LOCAL_SETTINGS = path.join(__dirname, "config.js");
const EXTRACTED_SETTINGS = path.join(EXTRACT_DIR, "config.js");

// === HELPERS ===
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function getLatestCommitSHA() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${BRANCH}`;
    const res = await axios.get(url, {
      headers: { 
        "User-Agent": "Private-Bot",
        "Accept": "application/vnd.github.v3+json"
      },
      timeout: 10000
    });
    return res.data.sha;
  } catch (err) {
    console.error(chalk.red("❌ Failed to fetch latest commit from GitHub:"), err.message);
    return null;
  }
}

function readCachedSHA() {
  const shaFile = path.join(TEMP_DIR, "commit.sha");
  if (fs.existsSync(shaFile)) {
    return fs.readFileSync(shaFile, "utf-8").trim();
  }
  return null;
}

function saveCachedSHA(sha) {
  const shaFile = path.join(TEMP_DIR, "commit.sha");
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  fs.writeFileSync(shaFile, sha);
}

// === DOWNLOAD & EXTRACT ===
async function downloadAndExtract(force = false) {
  try {
    // Skip version check if force download or no existing files
    if (!force && fs.existsSync(EXTRACT_DIR)) {
      const latestSHA = await getLatestCommitSHA();
      const cachedSHA = readCachedSHA();

      if (cachedSHA === latestSHA) {
        console.log(chalk.green("✅ Bot is up-to-date, skipping download."));
        return;
      }
    }

    console.log(chalk.yellow("📥 Downloading latest bot..."));
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

    console.log(chalk.cyan("📤 Extracting bot files..."));
    if (fs.existsSync(EXTRACT_DIR)) {
      fs.rmSync(EXTRACT_DIR, { recursive: true, force: true });
    }
    
    const zip = new AdmZip(ZIP_PATH);
    zip.extractAllTo(TEMP_DIR, true);

    // Save latest SHA
    const latestSHA = await getLatestCommitSHA();
    if (latestSHA) saveCachedSHA(latestSHA);

    // Clean up zip file
    if (fs.existsSync(ZIP_PATH)) {
      fs.unlinkSync(ZIP_PATH);
    }

    console.log(chalk.green("✅ Download and extraction completed!"));

  } catch (e) {
    console.error(chalk.red("❌ Download/Extract failed:"), e.message);
    
    // If we have existing files, use them even if download fails
    if (fs.existsSync(EXTRACT_DIR)) {
      console.log(chalk.yellow("⚠️ Using existing bot files despite download failure."));
      return;
    }
    throw e;
  }
}

async function applyLocalSettings() {
  if (!fs.existsSync(LOCAL_SETTINGS)) {
    console.log(chalk.yellow("⚠️ No local settings file found."));
    return;
  }

  try {
    if (!fs.existsSync(EXTRACT_DIR)) {
      throw new Error("Extracted directory not found");
    }
    fs.copyFileSync(LOCAL_SETTINGS, EXTRACTED_SETTINGS);
    console.log(chalk.green("🛠️ Local settings applied."));
  } catch (e) {
    console.error(chalk.red("❌ Failed to apply local settings:"), e.message);
  }

  await delay(500);
}

function startBot() {
  console.log(chalk.cyan("🚀 Launching bot instance..."));

  if (!fs.existsSync(EXTRACT_DIR)) {
    console.error(chalk.red("❌ Extracted directory not found. Cannot start bot."));
    return;
  }

  const mainFile = path.join(EXTRACT_DIR, "index.js");
  if (!fs.existsSync(mainFile)) {
    console.error(chalk.red("❌ index.js not found in extracted directory."));
    console.log(chalk.yellow("📁 Available files:"), fs.readdirSync(EXTRACT_DIR));
    return;
  }

  console.log(chalk.green("🤖 Starting bot..."));
  const bot = spawn("node", ["index.js"], {
    cwd: EXTRACT_DIR,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  bot.on("close", (code) => {
    console.log(chalk.red(`💥 Bot terminated with exit code: ${code}`));
    // Auto-restart on crash
    if (code !== 0) {
      console.log(chalk.yellow("🔄 Restarting bot in 3 seconds..."));
      setTimeout(startBot, 3000);
    }
  });

  bot.on("error", (err) => {
    console.error(chalk.red("❌ Bot failed to start:"), err);
    console.log(chalk.yellow("🔄 Restarting bot in 3 seconds..."));
    setTimeout(startBot, 3000);
  });
}

// === RUN ===
(async () => {
  try {
    console.log(chalk.blue("🔧 Initializing bot launcher..."));
    await downloadAndExtract();
    await applyLocalSettings();
    startBot();
  } catch (e) {
    console.error(chalk.red("❌ Fatal error in main execution:"), e.message);
    process.exit(1);
  }
})();