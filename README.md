<p align="center">
  <img src="https://files.catbox.moe/ty9xvk.jpg" alt="venom-xmd" width="300"/>
</p>

<p align="center">
  <a href="https://dave-sessions.onrender.com/pair/">
    <img src="https://img.shields.io/badge/Get-Pair_Code-purple?style=for-the-badge&logo=whatsapp" alt="Get Pair Code" width="200">
  </a>

  <a href="https://github.com/gifteddevsmd/VENOM-XMD/fork">
    <img src="https://img.shields.io/badge/Fork-venom--xmd-blue?style=for-the-badge&logo=github" alt="Fork venom-xmd" width="200">
  </a>

  <a href="https://heroku.com/deploy?template=https://github.com/gifteddevsmd/VENOM-XMD">
    <img src="https://img.shields.io/badge/Deploy-Heroku-430098?style=for-the-badge&logo=heroku" alt="Deploy to Heroku" width="200">
  </a>

  <a href="https://davexdeploymentspacs.vercel.app/">
    <img src="https://img.shields.io/badge/Deploy-venom--xmd-green?style=for-the-badge&logo=vercel" alt="Deploy venom-xmd" width="200">
  </a>

  <a href="https://github.com/gifteddevsmd/VENOM-XMD/archive/refs/heads/main.zip">
    <img src="https://img.shields.io/badge/Download-ZIP_File-orange?style=for-the-badge&logo=github" alt="Download ZIP" width="200">
  </a>
</p>

## 🚀 Heroku Deployment Instructions

### Step 1: Deploy to Heroku
Click the **"Deploy to Heroku"** button above to start the deployment process.

### Step 2: Configure Environment Variables
During deployment, set these environment variables:
- `SESSION_ID` : Your WhatsApp session ID if you have one

### Step 3: Start Worker Dyno
**IMPORTANT:** After deployment finishes, you MUST start the worker:

1. Go to your Heroku app dashboard
2. Click on the "Resources" tab
3. Find the "worker" process under "Free Dynos"
4. Click the pencil/edit icon
5. Toggle the switch to **ON**
6. Click "Confirm"

### Step 4: Get Pair Code
Once the worker is running:
1. Go to pair site 
2. Look for: `"Enter the WhatsApp number you want to use as a bot"`
3. Enter your number when prompted in the logs
4. Get the pair code 
5. Enter the code in your WhatsApp → Linked Devices

