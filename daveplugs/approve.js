const axios = require('axios');

let daveplug = async (m, { reply, text, dave, participants, isAdmins }) => {
    if (!m.isGroup) return reply('💠 ' + mess.group);
    if (!isAdmins) return reply('💠 This feature is only for group admins');

    const responseList = await dave.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) return reply('💠 No pending requests detected at the moment!');

    for (const participant of responseList) {
        await dave.groupRequestParticipantsUpdate(
            m.chat,
            [participant.jid], // Approve/reject each participant individually
            'approve' // or 'reject'
        );
    }

    reply('💠 VENOM-XMD has approved all pending requests');
};

daveplug.help = ['approve'];
daveplug.tags = ['approve-all'];
daveplug.command = ['approve'];

module.exports = daveplug;