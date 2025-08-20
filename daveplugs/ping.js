const axios = require("axios");
const os = require('os');

let daveplug = async (m, { reply, dave }) => {
  await m.reply(`💠 Checking RACHEL-XMD system performance, please wait...`);

  const memoryUsage = process.memoryUsage();
  const cpuInfo = os.cpus().map(cpu => ({
    total: Object.values(cpu.times).reduce((a, b) => a + b, 0),
    times: cpu.times,
  }));

  const totalCpuInfo = cpuInfo.reduce((acc, cpu) => ({
    total: acc.total + cpu.total,
    times: {
      user: (acc.times.user || 0) + (cpu.times.user || 0),
      nice: (acc.times.nice || 0) + (cpu.times.nice || 0),
      sys: (acc.times.sys || 0) + (cpu.times.sys || 0),
      idle: (acc.times.idle || 0) + (cpu.times.idle || 0),
      irq: (acc.times.irq || 0) + (cpu.times.irq || 0),
    },
  }), {
    total: 0,
    times: {},
  });

  const startTime = performance.now();
  const latency = performance.now() - startTime;
  const finalStatus = `💠 RACHEL-XMD system latency: ${latency.toFixed(4)} ms`;

  m.reply(finalStatus);
};  

daveplug.help = ['ping'];
daveplug.tags = ['status'];
daveplug.command = ['ping2'];

module.exports = daveplug;