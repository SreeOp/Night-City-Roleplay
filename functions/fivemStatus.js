const Discord = require('discord.js');
const axios = require('axios');
const moment = require('moment-timezone');
const IP = "143.244.135.94:30120";
const Channel_id = "1296783788202004532";
const Message_id = "1313325872916463658";
const Guild_id = "1120436484806287493";
const color_filter = [
    "^0",
    "^1",
    "^2",
    "^3",
    "^4",
    "^5",
    "^6",
    "^7",
    "^8",
    "^9"
];

module.exports = (client) => {
    function getCurrentISTTime() {
        return moment().tz('Asia/Kolkata').format('h:mm A');
    }

    let oldPlayers = -1;

    console.log('Zyronix City Status Loaded');
    setInterval(updateServerStatus, 30000);

    async function updateServerStatus() {
        if (!client.isReady()) return;

        const currentTime = getCurrentISTTime();
        let guild = client.guilds.cache.get(Guild_id);

        if (Channel_id && Message_id) {
            try {
                const [dynamicRes, playersRes] = await Promise.all([
                    axios.get(`http://${IP}/dynamic.json`, { timeout: 10000 }),
                    axios.get(`http://${IP}/players.json`, { timeout: 10000 })
                ]);

                if (dynamicRes.status === 200 && playersRes.status === 200) {
                    const dynamicData = dynamicRes.data;
                    const playersData = playersRes.data;

                    let hostName = dynamicData.hostname;
                    for (const filter of color_filter) {
                        hostName = hostName.replace(new RegExp(filter, 'g'), '');
                    }

                    const embed = new Discord.EmbedBuilder()
                        .setColor('Purple')
                        .setDescription('**Server Name**\n```Night City```\n**How to join the server?**\nYou can join the server **Night City** using our IP: ```connect play.nightcity.test```. Live server status can be tracked below!!')
                        .addFields(
                            { name: 'Server Status', value: '```Online ✅```', inline: true },
                            { name: 'Online Players', value: `\`\`\`${dynamicData.clients}/${dynamicData.sv_maxclients}\`\`\``, inline: true },
                            { name: 'Restart Times', value: '```6:30 PM```', inline: true }
                        )
                        .setAuthor({ name: 'Night City | Server Status', iconURL: guild.iconURL() })
                        .setImage('https://r2.fivemanage.com/pub/8drfou30xp4e.gif')
                        .setFooter({ text: `Night City | Last Updated at ${currentTime}`, iconURL: client.user.displayAvatarURL() });

                    const livePlayerNames = playersData
                        .sort((a, b) => a.id - b.id)
                        .map(player => `[${player.id}] ${player.name}\n`);

                    for (let i = 0; i < livePlayerNames.length; i += 30) {
                        embed.addFields({ name: 'ㅤ', value: livePlayerNames.slice(i, i + 30).join(''), inline: true });
                    }

                    const channel = await client.channels.fetch(Channel_id);
                    const msg = await channel.messages.fetch(Message_id);

                    await msg.edit({ embeds: [embed] });

                    client.user.setActivity(`${dynamicData.clients} players on Night City`, { type: Discord.ActivityType.Watching });
                }
            } catch (error) {
                console.error('Error fetching server data:', error);

                const embed = new Discord.EmbedBuilder()
                    .setColor('Red')
                    .setDescription('🔴Server is temporarily Unavailable🔴')
                    .addFields(
                        { name: 'Server Status', value: '```Offline ❌```', inline: true },
                        { name: 'Online Players', value: '```0/0```', inline: true },
                        { name: 'Restart Times', value: '```6:30 PM```', inline: true }
                    )
                    .setAuthor({ name: 'Night City | Server Status', iconURL: guild.iconURL() })
                    .setFooter({ text: `Night City | Last Updated at ${currentTime}`, iconURL: client.user.displayAvatarURL() });

                const channel = await client.channels.fetch(Channel_id);
                const msg = await channel.messages.fetch(Message_id);

                await msg.edit({ embeds: [embed] });

                client.user.setActivity('🔴Server is unavailable🔴', { type: Discord.ActivityType.Watching });
            }
        }
    }
};
