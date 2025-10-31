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
      timeout: 60000,
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
    fs.unlinkSync(ZIP_PATH);

    console.log(chalk.green("✅ Download & extraction completed!"));
    return true;
  } catch (e) {
    console.error(chalk.red("❌ Download failed:"), e.message);
    return false;
  }
}

// === BOT START FUNCTION ===
let botProcess = null;
function startBot() {
  console.log(chalk.cyan("🚀 Starting WhatsApp Bot..."));

  const mainFile = path.join(EXTRACT_DIR, "index.js");
  if (!fs.existsSync(mainFile)) {
    console.log(chalk.red("❌ index.js not found at:"), mainFile);
    return false;
  }

  console.log(chalk.green("🎯 Launching bot using node index.js"));
  console.log(chalk.blue("📁 Working Directory:"), EXTRACT_DIR);

  botProcess = spawn("node", ["index.js"], {
    cwd: EXTRACT_DIR,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      FORCE_COLOR: "1",
    },
  });

  botProcess.on("error", (err) => {
    console.error(chalk.red("💥 Bot process crashed:"), err);
    console.log(chalk.yellow("🔁 Restarting in 10 seconds..."));
    setTimeout(startBot, 10000);
  });

  botProcess.on("exit", (code, signal) => {
    console.log(
      chalk.yellow(`⚠️ Bot exited (code: ${code}, signal: ${signal})`)
    );
    console.log(chalk.blue("🔄 Restarting bot in 10 seconds..."));
    setTimeout(startBot, 10000);
  });
}

// === AUTO-UPDATER ===
async function autoUpdate() {
  console.log(chalk.magenta("🔁 Checking for updates every 1 hour..."));

  setInterval(async () => {
    console.log(chalk.magenta("\n📦 Checking GitHub for new updates..."));

    try {
      const success = await downloadAndExtract();
      if (success) {
        console.log(chalk.green("🆕 Update applied. Restarting bot..."));
        if (botProcess) botProcess.kill("SIGTERM");
        setTimeout(startBot, 5000);
      }
    } catch (e) {
      console.error(chalk.red("❌ Auto-update failed:"), e.message);
    }
  }, 60 * 60 * 1000); // every 1 hour
}

// === MAIN EXECUTION ===
(async () => {
  console.log(chalk.blue("🤖 WhatsApp Bot Launcher Initializing..."));

  try {
    console.log(chalk.yellow("📦 Fetching latest bot code..."));
    const success = await downloadAndExtract();

    if (!success) {
      console.error(chalk.red("❌ Could not download bot files. Retrying..."));
      return setTimeout(() => startBot(), 10000);
    }

    console.log(chalk.yellow("🎬 Launching bot now..."));
    startBot();
    autoUpdate();

    console.log(chalk.green("🛜 Launcher active and monitoring bot process..."));

    // graceful shutdown handlers
    process.on("SIGINT", () => {
      console.log(chalk.yellow("\n🛑 Manual stop detected. Exiting..."));
      if (botProcess) botProcess.kill("SIGTERM");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log(chalk.yellow("\n🛑 System termination signal. Exiting..."));
      if (botProcess) botProcess.kill("SIGTERM");
      process.exit(0);
    });
  } catch (error) {
    console.error(chalk.red("💥 Launcher crashed:"), error);
    console.log(chalk.yellow("🔁 Attempting restart in 10 seconds..."));
    setTimeout(() => startBot(), 10000);
  }
})();