const axios = require('axios');

let daveplug = async (m, { text, dave, participants, isAdmins, reply }) => {
    if (!m.isGroup) return reply(mess.group);
    if (!isAdmins) return reply("💠 This feature is only for group admins");

    const responseList = await dave.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) return reply("💠 No pending requests detected");

    for (const participan of responseList) {
        await dave.groupRequestParticipantsUpdate(
            m.chat,
            [participan.jid], // Reject each participant individually
            "reject"
        );
    }

    reply("💠 Pending requests have been rejected!");
};

daveplug.help = ['reject'];
daveplug.tags = ['reject'];
daveplug.command = ['reject'];

module.exports = daveplug;