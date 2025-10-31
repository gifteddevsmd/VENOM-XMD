const fs = require('fs')
const path = require('path')
if (fs.existsSync(path.join(__dirname, './.env'))) {
    require('dotenv').config({ path: path.join(__dirname, './.env') })
}

module.exports = {
  BOT_NAME: process.env.BOT_NAME,
  OWNER_NAME: process.env.OWNER_NAME,
  OWNER_NUMBER: process.env.OWNER_NUMBER,
  SESSION_DIR: process.env.SESSION_DIR,
  SESSION_ID: process.env.SESSION_ID,
  NO_PREFIX: process.env.NO_PREFIX === 'true',
  STATUS_VIEW: process.env.STATUS_VIEW === 'true',
  updateZipUrl: "https://codeload.github.com/private-254/private/zip/refs/heads/main",
};