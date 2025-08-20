const axios = require('axios');

let daveplug = async (m, { daveshown, text, dave, reply, isAdmins }) => {
    if (!m.isGroup) return reply("💠 Only for groups");
    if (!isAdmins && !daveshown) return reply("💠 Admins only");

    await dave.groupRevokeInvite(m.chat)
        .then(res => reply("💠 Invite link successfully revoked"))
        .catch(() => reply("💠 Failed to revoke invite"));
};

daveplug.help = ['restrict'];
daveplug.tags = ['reset'];
daveplug.command = ['revoke'];

module.exports = daveplug;